<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-icon :icon="arrowBackOutline" @click="backRoute"></ion-icon>
      </ion-buttons>
      <ion-title class="cartilla-title">REPORTE DE CARTILLAS</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <div class="reporte-container">
      <div class="text-help">ESCOGA EL RANGO DE FECHA PARA EL REPORTE</div>
      <div class="container">
        <div class="title"><b>FECHA INICIAL</b></div>
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-modal :keep-contents-mounted="true">
          <ion-datetime
            v-model="datetime1"
            locale="es-ES"
            value="2023-04-01T00:00:00"
            id="datetime"
          ></ion-datetime>
        </ion-modal>
      </div>
      <div class="container">
        <div class="title"><b>FECHA FINAL</b></div>
        <ion-datetime-button datetime="datetime2"></ion-datetime-button>
        <ion-modal :keep-contents-mounted="true">
          <ion-datetime
            v-model="datetime2"
            locale="es-ES"
            id="datetime2"
          ></ion-datetime>
        </ion-modal>
      </div>
    </div>
    <ion-button
      class="button-option"
      expand="block"
      @click="generarReporte"
      :disabled="disableB"
    >
      <ion-label>DESCARGAR REPORTE</ion-label>
    </ion-button>
  </ion-content>

  <ion-alert
    :is-open="downloaded"
    header="ALERTA"
    sub-header="REPORTE DESCARGADO"
    :message="`El reporte se descargo en Documentos`"
    :buttons="['OK']"
    @didDismiss="downloaded = false"
  ></ion-alert>
</template>

<script lang="ts">
import { arrowBackOutline } from "ionicons/icons";
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
  IonDatetime,
  IonDatetimeButton,
  toastController,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import createApi from "@/boot/CapacitorHTTP";
import { read, utils, write } from "xlsx";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import ExcelJS from "exceljs";
import { getWeek } from "date-fns";
import { useAuthStore } from "@/Store/authStore";
import { useRouter } from "vue-router";
export default {
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
    IonDatetime,
    IonDatetimeButton,
    toastController,
  },
  emits: ["back"],
  setup(props, { emit }) {
    const auth = useAuthStore();
    const urlExcel: any = ref("");
    const openFile = ref(false);
    const msgOpFile = ref("");
    const isOpen = ref(false);
    const datetime1 = ref("2023-04-01T00:00:00");
    const datetime2 = ref();
    const downloaded = ref(false);
    const messageAlert = ref("Se ha descargado el reporte en Documentos");
    const excelData = ref();
    const reportPrimers = ref();
    const router = useRouter();
    const disableB = ref(false);
    const api = createApi(auth, router);
    const backRoute = () => {
      emit("back");
    };
    const obtenerFechaActual = () => {
      const fecha = new Date();
      const anio = fecha.getFullYear();
      const mes = padZero(fecha.getMonth() + 1);
      const dia = padZero(fecha.getDate());
      const hora = padZero(fecha.getHours());
      const minutos = padZero(fecha.getMinutes());
      const segundos = padZero(fecha.getSeconds());
      datetime2.value = `${anio}-${mes}-${dia}T${hora}:${minutos}:${segundos}`;
    };
    const padZero = (valor: any) => {
      return valor.toString().padStart(2, "0");
    };
    const writeDB = (worksheet: any) => {
      console.log(reportPrimers.value);
      let rowIndex = 1;
      reportPrimers.value.forEach((val: any) => {
        let datePrimer = new Date(val.dateSave);
        const monthNames = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];
        const weekNumber = getWeek(datePrimer);
        const month = monthNames[datePrimer.getMonth()];
        const hours = datePrimer.getHours();
        const minutes = datePrimer.getMinutes();
        const seconds = datePrimer.getSeconds();
        const day = datePrimer.getDate();
        const monthNumber = datePrimer.getMonth() + 1;
        const year = datePrimer.getFullYear();
        val.primerConditions.forEach((condit: any) => {
          let IdICS = utils.encode_cell({ c: 0, r: rowIndex });
          let clase = utils.encode_cell({ c: 1, r: rowIndex });
          let mes = utils.encode_cell({ c: 2, r: rowIndex });
          let semana = utils.encode_cell({ c: 3, r: rowIndex });
          let fecha = utils.encode_cell({ c: 4, r: rowIndex });
          let hora = utils.encode_cell({ c: 5, r: rowIndex });
          let horario = utils.encode_cell({ c: 6, r: rowIndex });
          let actObs = utils.encode_cell({ c: 7, r: rowIndex });
          let nombObs = utils.encode_cell({ c: 8, r: rowIndex });
          let dni = utils.encode_cell({ c: 9, r: rowIndex });
          let cargObs = utils.encode_cell({ c: 10, r: rowIndex });
          let espc = utils.encode_cell({ c: 11, r: rowIndex });
          let categ = utils.encode_cell({ c: 12, r: rowIndex });
          let subCateg = utils.encode_cell({ c: 13, r: rowIndex });
          let desc = utils.encode_cell({ c: 14, r: rowIndex });
          let alto = utils.encode_cell({ c: 17, r: rowIndex });
          let medio = utils.encode_cell({ c: 18, r: rowIndex });
          let bajo = utils.encode_cell({ c: 19, r: rowIndex });
          let seguro = utils.encode_cell({ c: 20, r: rowIndex });
          let riesgoso = utils.encode_cell({ c: 21, r: rowIndex });
          let aplica = utils.encode_cell({ c: 22, r: rowIndex });
          worksheet.getCell(IdICS).value = val.id;
          worksheet.getCell(clase).value = "Condiciones";
          worksheet.getCell(mes).value = month;
          worksheet.getCell(semana).value = `Semana ${weekNumber}`;
          worksheet.getCell(fecha).value = `${padZero(day)}/${padZero(
            monthNumber
          )}/ ${year}`;
          worksheet.getCell(hora).value = `${padZero(hours)}:${padZero(
            minutes
          )}:${padZero(seconds)}`;
          worksheet.getCell(horario).value = val.horario_id.name;
          worksheet.getCell(actObs).value = val.warned_activity;
          worksheet.getCell(nombObs).value =
            `${val.user.lastname} ${val.user.firstname}`.toUpperCase();
          worksheet.getCell(dni).value = val.user.dni;
          worksheet.getCell(cargObs).value = val.user.cargo.toUpperCase();
          worksheet.getCell(espc).value = val.specialty_id.name.toUpperCase();
          worksheet.getCell(categ).value = condit.sub_condition_id.act_id.name;
          worksheet.getCell(subCateg).value = condit.sub_condition_id.name;
          worksheet.getCell(desc).value = condit.comment_obs;
          if (condit.is_risk == 0) {
            worksheet.getCell(seguro).value = 1;
          } else if(condit.is_risk == 1) {
            worksheet.getCell(riesgoso).value = 1;
            switch (condit.risk_id.id) {
              case 3:
                worksheet.getCell(bajo).value = "X";
                break;
              case 2:
                worksheet.getCell(medio).value = "X";
                break;
              case 1:
                worksheet.getCell(alto).value = "X";
                break;
            }
          }
          else{
            worksheet.getCell(aplica).value = "X";
          }
          rowIndex++;
        });
        val.primerShowActs.forEach((act: any) => {
          let IdICS = utils.encode_cell({ c: 0, r: rowIndex });
          let clase = utils.encode_cell({ c: 1, r: rowIndex });
          let mes = utils.encode_cell({ c: 2, r: rowIndex });
          let semana = utils.encode_cell({ c: 3, r: rowIndex });
          let fecha = utils.encode_cell({ c: 4, r: rowIndex });
          let hora = utils.encode_cell({ c: 5, r: rowIndex });
          let horario = utils.encode_cell({ c: 6, r: rowIndex });
          let actObs = utils.encode_cell({ c: 7, r: rowIndex });
          let nombObs = utils.encode_cell({ c: 8, r: rowIndex });
          let dni = utils.encode_cell({ c: 9, r: rowIndex });
          let cargObs = utils.encode_cell({ c: 10, r: rowIndex });
          let espc = utils.encode_cell({ c: 11, r: rowIndex });
          let categ = utils.encode_cell({ c: 12, r: rowIndex });
          let subCateg = utils.encode_cell({ c: 13, r: rowIndex });
          let desc = utils.encode_cell({ c: 14, r: rowIndex });
          let barr = utils.encode_cell({ c: 15, r: rowIndex });
          let pcel = utils.encode_cell({ c: 16, r: rowIndex });
          let seguro = utils.encode_cell({ c: 20, r: rowIndex });
          let riesgoso = utils.encode_cell({ c: 21, r: rowIndex });
          let aplica = utils.encode_cell({ c: 22, r: rowIndex });
          worksheet.getCell(IdICS).value = val.id;
          worksheet.getCell(clase).value = "Actos";
          worksheet.getCell(mes).value = month;
          worksheet.getCell(semana).value = `Semana ${weekNumber}`;
          worksheet.getCell(fecha).value = `${padZero(day)}/${padZero(
            monthNumber
          )}/ ${year}`;
          worksheet.getCell(hora).value = `${padZero(hours)}:${padZero(
            minutes
          )}:${padZero(seconds)}`;
          worksheet.getCell(horario).value = val.horario_id.name;
          worksheet.getCell(actObs).value = val.warned_activity;
          worksheet.getCell(nombObs).value =
            `${val.user.lastname} ${val.user.firstname}`.toUpperCase();
          worksheet.getCell(dni).value = val.user.dni;
          worksheet.getCell(cargObs).value = val.user.cargo.toUpperCase();
          worksheet.getCell(espc).value = val.specialty_id.name.toUpperCase();
          worksheet.getCell(categ).value = act.sub_act_id.act_id.name;
          worksheet.getCell(subCateg).value = act.sub_act_id.name;
          worksheet.getCell(desc).value = act.comment_obs;
          if (act.is_risk == 0) {
            worksheet.getCell(seguro).value = 1;
          } else if(act.is_risk == 1){
            console.log(act);
            worksheet.getCell(riesgoso).value = 1;
            worksheet.getCell(barr).value = act.behavioral_barrier_id.name;
            worksheet.getCell(pcel).value = act.body_part_id.name;
          }
          else{
            worksheet.getCell(aplica).value = "X";
          }
          rowIndex++;
        });
      });
    };
    reportPrimers.value;
    const generarReporte = async () => {
      disableB.value = true;
      try {
        messageAlert.value = "Se ha descargado el reporte en Documentos";
        const response = await api.get(
          `/api/v1/primers/report?fechaInicio=${datetime1.value}&fechaFin=${datetime2.value}`
        );
        if (response.status === 200) {
          reportPrimers.value = response.data;
          const filePath = "assets/ReporteDB.xlsx"; // Ruta al archivo Excel en la carpeta "assets"
          const f = await (await fetch(filePath)).arrayBuffer();
          const wb = read(f, { type: "array" });
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(f);
          const worksheet = workbook.getWorksheet("BD-DETALLADO");
          excelData.value = wb.Sheets["BD-DETALLADO"];
          writeDB(worksheet);
          const modifiedExcelData = await workbook.xlsx.writeBuffer();
          const modifiedBlob = new Blob([modifiedExcelData], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const reader = new FileReader();
          reader.readAsDataURL(modifiedBlob);
          let urlExcel =
            `${datetime1.value} HASTA ${datetime2.value}.xlsx`.replace(
              /:/g,
              "-"
            );
          reader.onloadend = async () => {
            const dataUrl: any = reader.result;
            // Guardar el archivo
            await Filesystem.writeFile({
              path: urlExcel,
              data: dataUrl,
              directory: Directory.Documents,
            }).then((val) => {
              Filesystem.getUri({
                path: urlExcel,
                directory: Directory.Documents,
              }).then((uri) => {
                downloaded.value = true;
              });
            });
          };
        } else {
          messageAlert.value = "Hubo un error al descargar el archivo";
          disableB.value = true;
        }
      } catch (error) {
        console.error(error);
        messageAlert.value = "Hubo un error al descargar el archivo";
        disableB.value = true;
      } finally {
        disableB.value = false;
      }
    };
    onMounted(() => {
      obtenerFechaActual();
    });
    return {
      arrowBackOutline,
      backRoute,
      datetime1,
      datetime2,
      generarReporte,
      downloaded,
      isOpen,
      messageAlert,
      disableB,
    };
  },
};
</script>

<style lang="scss" scoped>
ion-toolbar {
  --ion-color-primary: white;

  --background: #07166a !important;
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
ion-content {
  --padding-bottom: 70px;
  --color: black;
  --background: white;
  .primer-title {
    text-align: center;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 0.03rem solid #07166a;
  }
  ion-button {
    margin-top: 15px;
    --background: #07166a;
    --color: #fcf8f5;
    --border-color: #07166a;
    width: 100%;
  }
}
ion-icon {
  padding-left: 8px;
  color: white;
  font-size: 28px;
}
.reporte-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .text-help {
    margin-bottom: 15px;
  }
  .title {
    margin: 15px 0;
  }
  .container {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
