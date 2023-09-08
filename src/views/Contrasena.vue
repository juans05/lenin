<template>
  <div class="content">
    <div class="login-bg">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col class="card" size-xs="12" size-sm="10" size-md="8" size-lg="6">
            <form>
              <ion-row class="ion-margin-bottom">
                <ion-col size="12" class="ion-margin-bottom">
                  <h1 class="title ion-text-center custom-color" style="color: white;">Recuperar Contraseña</h1>
                </ion-col>
              </ion-row>
              <ion-row class="ion-margin-bottom">
                <ion-col size="12">
                  <ion-item class="ion-margin-bottom ion-align-self-center">
                    <ion-input v-model="dni" label="DNI" label-placement="floating"></ion-input>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="12">
                  <ion-row class="ion-margin-bottom">
                    <ion-col size="12" size-md="6">
                      <ion-button fill="solid" shape="round" color="primary" size="default"
                        class="login-button ion-text-capitalize ion-no-margin" @click="recoverPassword">
                        Recuperar Contraseña
                      </ion-button>
                    </ion-col>
                    <ion-col size="12" size-md="6">
                      <ion-button fill="clear" shape="round" color="medium" size="default"
                        class="back-button ion-text-capitalize ion-no-margin" @click="goBack">
                        Volver
                      </ion-button>
                    </ion-col>
                  </ion-row>
                </ion-col>
              </ion-row>
              <ion-row v-if="showWarning" class="ion-margin-top">
                <ion-col size="12">
                  <p class="warning-message">DNI inválido</p>
                </ion-col>
              </ion-row>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';

const dni = ref('');
const showWarning = ref(false);

function recoverPassword() {
  // Verificar si el DNI es válido
  if (isValidDNI(dni.value)) {
    // Aquí puedes agregar la lógica para recuperar la contraseña
    // utilizando el valor de dni.value
    console.log('Recuperar contraseña para DNI:', dni.value);
    // Redireccionar a la página de éxito de recuperación de contraseña
    router.push('/password-recovery-success');
  } else {
    showWarning.value = true;
  }
}

function goBack() {
  router.go(-1);
}

function isValidDNI(dni: string): boolean {
  // Verificar si el DNI es válido
  // Puedes implementar tu lógica de validación de DNI aquí
  // Devuelve true si es válido, de lo contrario devuelve false
  // Ejemplo de validación de DNI en Argentina (solo como referencia)
  return /^\d{7,8}$/.test(dni);
}
</script>
<style lang="scss" scoped>
.content {
  --background: #191919 !important;
  --color: #f4f5f8 !important;
}

.login-bg {
  height: 80vh;
  display: flex;
  align-items: center;

  form {
    width: 100%;
  }

  .card {
    background-color: #000000 !important;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .title {
    font-size: 24px !important;
    font-weight: bold;
    margin-bottom: 20px;
  }

  ion-item {
    --border-radius: 50px;
    border-radius: 50px;
    --background: #2e2e2e !important;
    --color: #f4f5f8 !important;
    letter-spacing: 1px;

    ion-label {
      padding: 2.5px 10px !important;
    }

    ion-input {
      padding: 2.5px 10px !important;
    }
  }

  a.fp {
    font-size: 0.8rem;
    letter-spacing: 1px;
    float: right;
    margin-top: 10px;
    text-decoration: none !important;
  }

  .login-button,
  .back-button {
    font-weight: 600 !important;
    width: 100% !important;
    letter-spacing: 1px;
  }

  .warning-message {
    color: #FF0000; /* Cambia el color a tu preferencia */
    font-size: 0.8rem;
    margin-top: 5px;
  }
}
</style>



