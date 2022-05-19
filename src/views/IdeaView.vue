<template>
  <div v-if="data !== false && data !== null">

        <section class="section">
        <div class="container">
            <div class="columns is-centered">
            <div class="column is-half">
                <h1 class="title"> <editable-span :text="data.short" @edited="updateShort"/> </h1>
                
                
                <div v-if="data.checked===false">
                    <button class="button is-danger is-small" style="margin:0 2px;" @click="deleteIdea">Delete the item</button>
                    <button class="button is-success is-small" @click="updateStatus1">Mark as complete</button>
                </div>
                <div v-else>
                    <button class="button is-danger is-small" style="margin:0 2px;" @click="deleteIdea">Delete the item</button>
                    <button class="button is-warning is-small" @click="updateStatus2">Mark as Incomplete</button>
                </div><br>

                
                <div>
                    Click to edit the category here; 
                    or go to "todo" page to create a new one:
                    <ul class="tags">
                        (Existing categories:
                        <li v-for="category in categories" :key="category.id">
                            <router-link :to="{name:'categoriesView', params:{categoryId:category.id}}">
                                <span class="tag is-info is-light" style="margin:3px">
                                    {{ category.name }}
                                </span>
                            </router-link>
                        </li>)
                    </ul>
                    
                    <editable-div :text="data.category" @edited="updateCat"/>
                </div>

<!--
                <div class="select is-primary">
                <select>
                    <option>Select dropdown</option>
                    <option v-for="category in categories" :key="category.id">{{ category.name }}</option>
                </select>
                </div>
    -->

                <br>
                <div>
                    Click to edit the summary here:
                    <editable-div :text="data.long" @edited="updateLong"/>
                </div>

            </div>
            </div>
        </div>
        </section>


  </div>
  <span v-else >
      loading
  </span>
</template>

<script>
import { db, auth } from "@/firebaseConfig.js"
import EditableSpan from '@/components/EditableSpan.vue'
import EditableDiv from '@/components/EditableDiv.vue'

export default {
    components: { EditableSpan, EditableDiv },
    name:"ideaView",
    props:["ideaId"],
    data:function(){
        return {
            data: false,
            newIdea: "",
            deleting: false,
            categories: false
        }
    },
    methods: {
        removeIdea: function(index) {
            let newSubIdeas = [...this.data.subIdeas] // copying the subIdeas list
            newSubIdeas = newSubIdeas.slice(0, index).concat(newSubIdeas.slice(index+1))
            this.$firestoreRefs.data.update({subIdeas:newSubIdeas})
        },
        updateShort: function(newShort) {
            this.$firestoreRefs.data.update({short:newShort})
        },
        updateLong: function(newLong) {
            this.$firestoreRefs.data.update({long:newLong})
        },
        updateCat: function(newCategory) {
            this.$firestoreRefs.data.update({category:newCategory})
        },
        deleteIdea: function() {
            this.data = false
            this.deleting = true
            alert("Successfully Deleted!")
            this.$firestoreRefs.data.delete().then(()=>{
                this.$router.push("/todos")
            });
        },
        updateStatus1: function() {
            this.$firestoreRefs.data.update({checked: true})
        },
        updateStatus2: function() {
            this.$firestoreRefs.data.update({checked: false})
        },
    },
    firestore: function() {
        return {
            data: db.collection("todoList").doc(this.ideaId),
            categories: db.collection('categories')
                          .where('owner', '==', auth.currentUser.uid)
        }
    },
    beforeUpdate: function() {
        // called whenever the data is being updated.
        // if data is being updated from "false" to "null" -- the document wasn't found.
        if (this.data === null && !this.deleting) {
            this.$router.replace("/404")
        }
        
    },
    created: function() {
        // a permission error won't trigger an update
        // so we do this to listen in on errors directly
        // This does also seem to happen on a failed read...
      this.$firestoreRefs.data.onSnapshot({error:(err)=>{
          console.log("Caught a firestore error", err.code)
          if(err.code == "permission-denied"  && !this.deleting){
            this.$router.replace("/404")
          }          
      }
      })
    },
}
</script>

<style scoped>
.delete {
    color:olive;
    cursor:pointer;
}
input {
    width:6rem;
    transition-duration: 100ms;

}

input:focus {
    width:15rem;
}
</style>