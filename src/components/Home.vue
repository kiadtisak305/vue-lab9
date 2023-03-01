<script setup>
import { ref } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../main.js"
import { useRouter } from "vue-router";
import { Icon } from '@iconify/vue';
import { async } from "@firebase/util";
const router = useRouter();

const menu = ref({
    nameTh: "",
    nameEn: "",
    price: 0,
    detail: "",
});
const editText = ref([]);
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

function editMenu(menulist) {

    editText.value = menulist
/*     menu.nameTh = menulist.data.nameTh
    menu.nameEn = menulist.data.nameEn
    menu.price = menulist.data.price
    menu.detail = menulist.data.detail */
}

async function updateMenu(id) {

    try {
        const washingtonRef = doc(db, "foodmanu", id);
        // Set the "capital" field of the city 'DC'
        await updateDoc(washingtonRef, menu.value);
        console.log("update menu")
        cancelUpdate()
    } catch (e) {
        console.error(e)
    }

}
function cancelUpdate(){
    editText.value = null;
}

async function deleteMenu(id, index) {
    if (confirm("คุณต้องการลบเมนูนี้หรือไม่ ?")) {
        await deleteDoc(doc(db, "foodmanu", id));
        console.log("Delete document with ID:", id);
        allMenu.value.splice(index, 1);
    }
}

function logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
        // Sign-out successful.
        if (confirm("คุณต้องการออกจากระบบ ?")) {
            router.push("/");
        }
    }).catch((error) => {
        // An error happened.
    });
}
</script>

<template>
    <div class="body">
        <div class="btlogout py-4 text-right">
            <v-btn @click="logout()">
                Logout
                <Icon icon="mdi:logout" width="20" height="20" />
            </v-btn>
        </div>
        <div class="py-4">
            <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
                <v-form ref="form">
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
                </v-form>
            </v-card>
        </div>

        <div class="py-4">
            <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="1300" rounded="lg">
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
                            <td>
                                <p v-if="menulist != editText">{{ menulist.data.nameTh }}</p>
                                <input v-else type="text" v-model="menu.nameTh">
                            </td>
                            <td>
                                <p v-if="menulist != editText">{{ menulist.data.nameEn }}</p>
                                <input v-else type="text" v-model="menu.nameEn">
                            </td>
                            <td>
                                <p v-if="menulist != editText">{{ menulist.data.price }}</p>
                                <input v-else type="number" v-model="menu.price">
                            </td>
                            <td>
                                <p v-if="menulist != editText">{{ menulist.data.detail }}</p>
                                <input v-else type="text" v-model="menu.detail">
                            </td>
                            <td>
                                <div v-if="menulist != editText">
                                    <v-btn variant="plain" @click="editMenu(menulist)">
                                        <Icon icon="material-symbols:edit-square-outline" width="30" height="30" />
                                    </v-btn>
                                    <v-btn variant="plain" @click="deleteMenu(menulist.id, index)">
                                        <Icon icon="ic:outline-delete-outline" color="red" width="30" height="30" />
                                    </v-btn>
                                </div>
                                <div v-else>
                                    <v-btn color="green" @click="updateMenu(menulist.id)">
                                        <Icon icon="line-md:confirm" color="white" width="30" height="30" />
                                    </v-btn>
                                    <v-btn color="red" @click="cancelUpdate()">
                                        <Icon icon="mdi:cancel-bold" color="white" width="30" height="30" />
                                    </v-btn>
                                </div>

                            </td>

                        </tr>
                    </tbody>
                </v-table>
            </v-card>
        </div>
    </div>
</template>

<style scoped> .body {
     background-image: url(@/assets/homebg.jpg);
     width: 100%;
     height: 100%;
     background-repeat: repeat-x;
     background-attachment: fixed;
     background-position: top center;
 }

 .btlogout {
     margin-right: 2rem;
 }
</style>