<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-icon :icon="arrowBackOutline" @click="backRoute"></ion-icon>
      </ion-buttons>
      <ion-title class="cartilla-title">CARTILLA: {{ primer.id }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <div class="primer-title">CARTILLA DE OBSERVACIÓN DE COMPORTAMIENTO</div>
    <ion-input
      class="bottom-mr"
      fill="outline"
      label="Actividad observada"
      label-placement="floating"
      :value="primer.warned_activity"
      :readonly="true"
    ></ion-input>
    <ion-input
      class="bottom-mr"
      fill="outline"
      label="Especialidad"
      label-placement="floating"
      :value="primer.specialty_id.name"
      :readonly="true"
    ></ion-input>
    <ion-input
      class="bottom-mr"
      fill="outline"
      label="Horarios"
      label-placement="floating"
      :value="primer.horario_id.name"
      :readonly="true"
    ></ion-input>
    <ion-button
      class="button-option"
      expand="block"
      @click="modalConditions.$el.present()"
    >
      <ion-label>CONDICIONES</ion-label>
    </ion-button>
    <ion-button
      class="button-option"
      expand="block"
      @click="modalActs.$el.present()"
    >
      <ion-label>ACTOS</ion-label>
    </ion-button>
    <!-- Este botón de Ionic se utiliza para mostrar la etiqueta "RECURSOS" 
    <ion-button class="button-option" expand="block">
      <ion-label>RECURSOS</ion-label>
    </ion-button>
    -->
    <!--
    <ion-button class="button-option" expand="block" @click="isOpen = true">
      <ion-label>DESCARGAR REPORTE</ion-label>
    </ion-button>
    -->
  </ion-content>
  <ion-modal ref="modalActs">
    <view-acts
      :acts="JSON.parse(JSON.stringify(primer.primerShowActs))"
      @back="modalActs.$el.dismiss()"
    />
  </ion-modal>
  <ion-modal ref="modalConditions">
    <view-conditions
      :acts="JSON.parse(JSON.stringify(primer.primerConditions))"
      @back="modalConditions.$el.dismiss()"
    />
  </ion-modal>
  <ion-alert
    :is-open="isOpen"
    header="ALERTA"
    sub-header="DESCARGAR REPORTE"
    :message="`¿Desea descargar el reporte ${primer.date_save}.xlsx?`"
    :buttons="alertButtons"
    @didDismiss="isOpen = false"
  ></ion-alert>
  <ion-alert
    :is-open="openFile"
    header="ALERTA"
    sub-header="ABRIR ARCHIVO"
    :message="msgOpFile"
    :buttons="['OK']"
    @didDismiss="openFile = false"
  ></ion-alert>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ViewActs from "./todocartilla/ViewActs.vue";
import ViewConditions from "./todocartilla/ViewConditions.vue";
import { arrowBackOutline } from "ionicons/icons";
import { read, utils, write } from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  IonButton,
  IonCol,
  IonBackButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonToggle,
  IonLabel,
  IonButtons,
  IonCheckbox,
  IonSelect,
  IonFooter,
  IonSelectOption,
  IonModal,
  IonAlert,
  IonIcon,
  IonInput,
  toastController,
} from "@ionic/vue";
import { useIndexStore } from "@/Store/indexStore";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { FileOpener } from "@ionic-native/file-opener";
import { Capacitor } from "@capacitor/core";

export default defineComponent({
  props: {
    primer: { type: Object },
  },
  emits: ["back"],
  components: {
    IonButton,
    IonCol,
    IonBackButton,
    IonContent,
    IonGrid,
    IonHeader,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar,
    IonToggle,
    IonLabel,
    IonButtons,
    IonCheckbox,
    IonSelect,
    IonFooter,
    IonSelectOption,
    IonModal,
    IonAlert,
    IonIcon,
    IonInput,
    ViewActs,
    ViewConditions,
  },
  setup(props, { emit }) {
    const excelData = ref<any>();
    const modalActs = ref();
    const isOpen = ref(false);
    const openFile = ref(false);
    const msgOpFile = ref("");
    const urlExcel: any = ref("");
    const alertButtons = [
      {
        text: "Cancel",
        role: "cancel",
        handler: () => {},
      },
      {
        text: "OK",
        role: "confirm",
        handler: async () => {
          const perms = await Filesystem.checkPermissions();
          const toast = await toastController.create({
            message: perms.publicStorage,
            duration: 1500,
            position: "bottom",
          });
          if (perms.publicStorage != "granted") {
            await Filesystem.requestPermissions();
          }
          await toast.present();
          await downloadExcel();
        },
      },
    ];
    const indexStore = useIndexStore();
    const modalConditions = ref();
    const backRoute = () => {
      emit("back");
    };
    const listActs = ref<Array<any>>([]);
    const listConditions = ref<Array<any>>([]);

    const parseConditions = () => {
      const uniqueActs: Array<any> = [];
      const ids: Array<any> = [];
      listConditions.value = [];
      props.primer.primerConditions?.forEach((obj: any) => {
        if (!ids.includes(obj.sub_condition_id.act_id.id)) {
          uniqueActs.push(obj.sub_condition_id.act_id);
          ids.push(obj.sub_condition_id.act_id.id);
        }
      });
      uniqueActs.forEach((uniqueCond) => {
        let condition = uniqueCond;
        let primConditions: Array<any> = [];
        props.primer.primerConditions?.forEach((obj: any) => {
          if (obj.sub_condition_id.act_id.id === condition.id) {
            primConditions.push(obj);
          }
        });
        listConditions.value.push({ ...condition, primConditions });
      });
    };
    const parseActs = () => {
      const uniqueActs: Array<any> = [];
      const ids: Array<any> = [];
      listActs.value = [];
      props.primer.primerShowActs?.forEach((obj: any) => {
        if (!ids.includes(obj.sub_act_id.act_id.id)) {
          uniqueActs.push(obj.sub_act_id.act_id);
          ids.push(obj.sub_act_id.act_id.id);
        }
      });
      uniqueActs.forEach((uniqueCond) => {
        let act = uniqueCond;
        let primConditions: Array<any> = [];
        props.primer.primerShowActs?.forEach((obj: any) => {
          if (obj.sub_act_id.act_id.id === act.id) {
            primConditions.push(obj);
          }
        });
        listActs.value.push({ ...act, primConditions });
      });
    };
    const writeConditions = (worksheet: any) => {
      listConditions.value.forEach((act: any) => {
        act.primConditions.forEach((subAct: any) => {
          let lCell: string = "";
          let mrCell: any;
          let sCell = `${act.id}.${indexStore.getIndexCond(
            act.id,
            subAct.sub_condition_id.name
          )}. ${subAct.sub_condition_id.name}.`;
          for (const eCell in excelData.value) {
            if (excelData.value.hasOwnProperty(eCell)) {
              const obj = excelData.value[eCell];
              if (obj.v == sCell) {
                lCell = eCell;
                break;
              }
            }
          }
          for (let i = 0; i < excelData.value["!merges"].length; i++) {
            const merge = excelData.value["!merges"][i];
            const startCell = utils.encode_cell(merge.s);
            const endCell = utils.encode_cell(merge.e);
            if (startCell === lCell || endCell === lCell) {
              mrCell = endCell;
              break;
            }
          }
          mrCell = utils.decode_cell(mrCell);
          if (subAct.is_risk == 0) {
            let toCell = utils.encode_cell({ c: mrCell.c + 1, r: mrCell.r });
            worksheet.getCell(toCell).value = "X";
          } else if (subAct.is_risk == 1|| subAct.is_risk == 2){
            let toCell = utils.encode_cell({ c: mrCell.c + 2, r: mrCell.r });
            worksheet.getCell(toCell).value = "X";
            switch (subAct.risk_id.id) {
              case 3:
                toCell = utils.encode_cell({ c: mrCell.c + 3, r: mrCell.r });
                break;
              case 2:
                toCell = utils.encode_cell({ c: mrCell.c + 4, r: mrCell.r });
                break;
              case 1:
                toCell = utils.encode_cell({ c: mrCell.c + 5, r: mrCell.r });
                break;
            }
            worksheet.getCell(toCell).value = "X";
            toCell = utils.encode_cell({ c: mrCell.c + 6, r: mrCell.r });
            worksheet.getCell(toCell).value = subAct.comment_obs;
          }
        });
      });
    };
    const writeActs = (worksheet: any) => {
      let splitDate = props.primer.dateSave.split(" ");
      worksheet.getCell("AB6").value = splitDate[0];
      worksheet.getCell("G8").value = splitDate[1];
      worksheet.getCell("AB7").value = props.primer.warned_activity;

      listActs.value.forEach((act: any) => {
        act.primConditions.forEach((subAct: any) => {
          let lCell: string = "";
          let mrCell: any;
          let sCell = `${act.id}.${indexStore.getIndexAct(
            act.id,
            subAct.sub_act_id.name
          )}. ${subAct.sub_act_id.name}.`;
          for (const eCell in excelData.value) {
            if (excelData.value.hasOwnProperty(eCell)) {
              const obj = excelData.value[eCell];
              if (obj.v == sCell) {
                lCell = eCell;
                break;
              }
            }
          }
          for (let i = 0; i < excelData.value["!merges"].length; i++) {
            const merge = excelData.value["!merges"][i];
            const startCell = utils.encode_cell(merge.s);
            const endCell = utils.encode_cell(merge.e);
            if (startCell === lCell || endCell === lCell) {
              mrCell = endCell;
              break;
            }
          }
          mrCell = utils.decode_cell(mrCell);
          if (subAct.is_risk == 0) {
            let toCell = utils.encode_cell({ c: mrCell.c + 1, r: mrCell.r });
            worksheet.getCell(toCell).value = "X";
          } else if (subAct.is_risk == 1 ||subAct.is_risk == 2) {
            let toCell = utils.encode_cell({ c: mrCell.c + 2, r: mrCell.r });
            worksheet.getCell(toCell).value = "X";
            toCell = utils.encode_cell({ c: mrCell.c + 3, r: mrCell.r });
            worksheet.getCell(toCell).value = String.fromCharCode(
              66 + subAct.behavioral_barrier_id.id
            );
            toCell = utils.encode_cell({ c: mrCell.c + 4, r: mrCell.r });
            worksheet.getCell(toCell).value = subAct.body_part_id.id;
            toCell = utils.encode_cell({ c: mrCell.c + 5, r: mrCell.r });
            worksheet.getCell(toCell).value = subAct.comment_obs;
          }
        });
      });
    };
    const downloadExcel = async () => {
      msgOpFile.value = "";
      parseConditions();
      parseActs();
      try {
        //XLSX
        const filePath =
          "assets/REPORTE.xlsx"; // Ruta al archivo Excel en la carpeta "assets"
        console.log(filePath);

        const f = await (await fetch(filePath)).arrayBuffer();
        const wb = read(f, { type: "array" });
        //EXCELJS
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(f);
        const worksheet = workbook.getWorksheet("CONDICIONES");
        excelData.value = wb.Sheets["CONDICIONES"];
        writeConditions(worksheet);
        excelData.value = wb.Sheets["ACTOS"];
        const worksheetActs = workbook.getWorksheet("ACTOS");
        writeActs(worksheetActs);
        const modifiedExcelData = await workbook.xlsx.writeBuffer();
        const modifiedBlob = new Blob([modifiedExcelData], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const reader = new FileReader();
        reader.readAsDataURL(modifiedBlob);
        urlExcel.value = `${props.primer.date_save}.xlsx`.replace(/:/g, "-");
        //saveAs(modifiedBlob, urlExcel.value);
        reader.onloadend = async () => {
          const dataUrl: any = reader.result;
          // Guardar el archivo
          await Filesystem.writeFile({
            path: urlExcel.value,
            data: dataUrl,
            directory: Directory.Documents,
          }).then((val) => {
            Filesystem.getUri({
              path: urlExcel.value,
              directory: Directory.Documents,
            }).then((uri) => {
              openFile.value = true;
              msgOpFile.value = `El archivo se descargo en: ${Directory.Documents}`;
              urlExcel.value = uri.uri;
            });
          });
        };
      } catch (error: any) {
        console.error(error);
        const toast = await toastController.create({
          message: error.message,
          duration: 1500,
          position: "bottom",
        });
        await toast.present();
      }
    };
    return {
      downloadExcel,
      arrowBackOutline,
      backRoute,
      modalActs,
      modalConditions,
      isOpen,
      alertButtons,
      openFile,
      msgOpFile,
    };
  },
});
</script>

<style scoped lang="scss">
ion-toolbar {
  --ion-color-primary: white;

  --background: #07166A !important;
  --color: white;

  --border-width: 0;
  --border-style: none;
  --border-color: transparent;
  --padding-top: 5px;
  --padding-bottom: 5px;
  .cartilla-title {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    color: white;
    min-width: 100%;
    font-weight: bold;
  }
}
ion-input {
  margin-top: 15px;
}
ion-content {
  --padding-bottom: 70px;
  --color: black;
  --background: white;
  .primer-title {
    text-align: center;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 0.03rem solid #07166A;
  }
  ion-button {
    margin-top: 15px;
    --background: #07166A;
    --color: #fcf8f5;
    --border-color: #07166A;
    width: 100%;
  }
}
ion-icon {
  padding-left: 8px;
  color: white;
  font-size: 28px;
}
</style>
