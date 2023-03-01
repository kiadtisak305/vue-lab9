<script setup>
import { ref } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
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
const editText = ref([]);
const allMenu = ref([]);
const dialog = ref(false);

//เพิ่มเมนู
async function addData() {
    try {
        const docRef = await addDoc(collection(db, "foodmanu"), menu.value);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
//แสดงเมนูทั้งหมด
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
//แก้ไขเมนู โดยแสดงข้อมูลของแถวที่เลือก
function editMenu(menulist) {
    editText.value = menulist
    menu.value = menulist.data
}
//ยืนยันการแก้ไข
async function updateMenu(id) {

    if (confirm("ยืนยันการแก้ไขเมนูนี้ ?")) {
        try {
            const washingtonRef = doc(db, "foodmanu", id);
            // Set the "capital" field of the city 'DC'
            await updateDoc(washingtonRef, menu.value);
            console.log("update menu")

        } catch (e) {
            console.error(e)
        }
        readUpdateMenu(id)
    }
}
//แสดงรายการเมนูที่แก้ไขแล้ว หลังจากกดยืนยัน
async function readUpdateMenu(id) {
    const docRef = doc(db, "foodmanu", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists(id)) {
        console.log(id , docSnap.data());
        const newEdit = docSnap.data()
        editText.value = newEdit
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}
//ยกเลิกแก้ไข
function cancelUpdate() {
    editText.value = null;
}
//ลบเมนูแถวที่เลือก
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
        <div class="Table">
            <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="1200">
                <v-card-text class="text-left">
                    <v-dialog v-model="dialog" persistent width="500">
                        <template v-slot:activator="{ props }">
                            <v-btn color="green" v-bind="props">
                                เพิ่มเมนู
                            </v-btn>
                        </template>
                        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="900" rounded="lg">
                            <v-form ref="form">
                                <v-text-field label="ชื่อเมนูไทย" variant="underlined" v-model="menu.nameTh"></v-text-field>
                                <v-text-field label="ชื่อเมนูอังกฤษ" variant="underlined"
                                    v-model="menu.nameEn"></v-text-field>
                                <v-text-field label="ราคา" suffix="฿" variant="underlined"
                                    v-model="menu.price"></v-text-field>
                                <v-textarea label="รายละเอียด" auto-grow variant="underlined" rows="1" row-height="15"
                                    v-model="menu.detail"></v-textarea>

                                <v-card-text class="text-center">
                                    <v-btn class="btndialogsave" color="green" @click="addData(), dialog = false">
                                        <Icon icon="line-md:confirm" color="white" width="30" height="30" />
                                    </v-btn>
                                    <v-btn class="btndialogcancel" color="red" @click="dialog = false">
                                        <Icon icon="mdi:cancel-bold" color="white" width="30" height="30" />
                                    </v-btn>
                                </v-card-text>
                            </v-form>
                        </v-card>
                    </v-dialog>

                    <v-btn class="btnshowmenu" color="blue" variant="tonal" @click="showMenu()">
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(menulist, index) in allMenu" :key="index">
                            <td>
                                <p v-if="menulist != editText">{{ menulist.data.nameTh }}</p>
                                <input size="10" v-else type="text" v-model="menu.nameTh">
                            </td>
                            <td>
                                <p v-if="menulist != editText">{{ menulist.data.nameEn }}</p>
                                <input size="10" v-else type="text" v-model="menu.nameEn">
                            </td>
                            <td>
                                <p v-if="menulist != editText">{{ menulist.data.price }}</p>
                                <input size="5" v-else type="number" v-model="menu.price">
                            </td>
                            <td>
                                <p v-if="menulist != editText">{{ menulist.data.detail }}</p>
                                <input size="15" v-else type="text" v-model="menu.detail">
                            </td>
                            <td>
                                <div class="text-center" v-if="menulist != editText">
                                    <v-btn class="btnedit" variant="plain" @click="editMenu(menulist)">
                                        <Icon icon="material-symbols:edit-square-outline" width="30" height="30" />
                                    </v-btn>
                                    <v-btn class="btndelete" variant="plain" @click="deleteMenu(menulist.id, index)">
                                        <Icon icon="ic:outline-delete-outline" color="red" width="30" height="30" />
                                    </v-btn>
                                </div>
                                <div v-else>
                                    <v-btn class="btnconfirm" color="green" @click="updateMenu(menulist.id)">
                                        <Icon icon="line-md:confirm" color="white" width="30" height="30" />
                                    </v-btn>
                                    <v-btn class="btncancel" color="red" @click="cancelUpdate()">
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

 .Table {
     padding: 14rem;
 }

 .btndialogsave {
     margin-left: 2rem;
     margin-right: 1rem;
 }

 .btndialogcancel {
     margin-left: 1rem;
     margin-right: 2rem;
 }

 .btnshowmenu {
     margin-left: 1rem;
 }

 .btnedit {
     margin-left: 1rem;
     margin-right: 1rem;
 }

 .btndelete {
     margin-left: 1rem;
     margin-right: 1rem;
 }

 .btnconfirm {
     margin-left: 1rem;
     margin-right: 1rem;
 }

 .btncancel {
     margin-left: 1rem;
     margin-right: 1rem;
 }

 .btlogout {
     margin-right: 2rem;
 }</style>