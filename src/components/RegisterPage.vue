<script setup>
import { ref } from "vue";
import {
    getAuth,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const regemail = ref("");
const regpassword = ref("");
const visible = ref(false);
const rules = ref({
    email: v => !!(v || '').match(/@/) || 'กรุณาป้อน e-mail',
    required: value => !!value || 'กรุณาป้อนรหัสผ่าน',
    length: len => v => (v || '').length >= len || `รหัสผ่านต้องมีความยาว ${len} ตัวขึ้นไป`,
    password: v => !!(v || '').match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/) || 'รหัสผ่านต้องประกอบด้วย อักขระพิมพ์ใหญ่-เล็ก และตัวเลข',
})

function register() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, regemail.value, regpassword.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("User = " + user);
            router.push("/");
            alert("สมัครสำเร็จ")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + errorMessage);
            // ..
        });
}
</script>

<template>
    <div>
        <h1>Register</h1>
    </div>
    <div class="py-4">
        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">

            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
                variant="outlined" v-model="regemail" :rules="[rules.email]"></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Password
            </div>

            <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
                @click:append-inner="visible = !visible" v-model="regpassword"
                :rules="[rules.required, rules.password, rules.length(8)]"></v-text-field>

            <v-btn block class="mb-8" color="blue" size="large" variant="tonal" @click="register()">
                register
            </v-btn>
        </v-card>
    </div>
</template>