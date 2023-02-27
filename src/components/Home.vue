<script setup>
import { ref } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../main.js"
import { useRouter } from "vue-router";
import { Icon } from '@iconify/vue';
const router = useRouter();

const menu = ref({
    nameTh: "",
    nameEn: "",
    price: 0,
    detail: "",
});
const allMenu = ref([]);

async function addUserData() {
    try {
        const docRef = await addDoc(collection(db, "foodmanu"), menu.value);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function showMenu() {
    const querySnapshot = await getDocs(collection(db, "foodmanu"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const myDoc = ref({ id: doc.id, data: doc.data() })
        //allMenu.value.push(doc.data());
        allMenu.value.push(myDoc.value);
    });
}

async function deleteMenu(id) {
    await deleteDoc(doc(db, "foodmanu", id));
    console.log("Delete document with ID:", id);
}

function logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
        // Sign-out successful.
        alert("ออกจากระบบสำเร็จ")
        router.push("/");

    }).catch((error) => {
        // An error happened.
    });
}
</script>

<template>
    <div class="py-4 text-right">
        <v-btn  @click="logout()">
            Logout <Icon icon="mdi:logout" width="20" height="20"/>
        </v-btn >
    </div>
    <div class="py-4">
        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
            <v-text-field label="ชื่อเมนูไทย" variant="underlined" v-model="menu.nameTh"></v-text-field>
            <v-text-field label="ชื่อเมนูอังกฤษ" variant="underlined" v-model="menu.nameEn"></v-text-field>
            <v-text-field label="ราคา" suffix="฿" variant="underlined" v-model="menu.price"></v-text-field>
            <v-textarea label="รายละเอียด" auto-grow variant="underlined" rows="1" row-height="15"
                v-model="menu.detail"></v-textarea>

            <v-card-text class="text-center">
                <v-btn color="green" variant="plain" @click="addUserData()">
                    เพิ่มข้อมูล
                </v-btn>
            </v-card-text>

        </v-card>
    </div>

    <div class="py-4">
        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="800" rounded="lg">
            <v-card-text class="text-left">
                <v-btn color="blue" variant="plain" @click="showMenu()">
                    แสดงเมนู
                </v-btn>
            </v-card-text>

            <v-progress-linear model-value="100" color="cyan" rounded></v-progress-linear>

            <v-table>
                <thead>
                    <tr>
                        <th>ชื่อเมนูไทย</th>
                        <th>ชื่อเมนูอังกฤษ</th>
                        <th>ราคา</th>
                        <th>รายละเอียด</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(menulist, index) in allMenu" :key="index">
                        <td>{{ menulist.data.nameTh }}</td>
                        <td>{{ menulist.data.nameEn }}</td>
                        <td>{{ menulist.data.price }}</td>
                        <td>{{ menulist.data.detail }}</td>
                        <td>
                            <v-btn  variant="plain" @click="deleteMenu(menulist.id)">
                                <Icon icon="ic:outline-delete-outline" color="red" width="30" height="30"/>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </div>
</template>