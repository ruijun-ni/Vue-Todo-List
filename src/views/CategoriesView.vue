<template>
  <div v-if="data !== false && data !== null">
  <!--      <h1>{{ data.name }}</h1>
        <ul>
            <li v-for="idea in filterByCategory" :key="idea.id">
                <router-link :to="{name:'ideaView', params:{ideaId:idea.id}}">
                        {{ idea.short }}
                </router-link>
            </li>
        </ul>

       
        <input v-model="newIdea" placeholder="add new to-do item" @keyup.enter="addIdea"/>
        <button @click="addIdea">+</button>
-->

        <section class="section m-auto">
            <div class="columns is-centered">
                <div class="column is-half">
                <nav class="panel is-success">
                    <p class="panel-heading">{{ data.name }}</p>
                    <div class="panel-block">
                    <div class="block m-auto">
                        <div class="field is-grouped">
                        <div class="control is-expanded">
                            <input v-model="newIdea" placeholder="add new to-do item" class="input is-success" @keyup.enter="addIdea"/>
                        </div>
                        <div class="control">
                            <button class="button is-primary" @click="addIdea">+</button>
                        </div>
                        </div>
                    </div>
                    </div>
                
                            
                    <div class="panel-block" v-for="idea in filterByCategory" :key="idea.id">
                
                    
                        <router-link :to="{name:'ideaView', params:{ideaId:idea.id}}">
                            <span class="tag is-success is-light">{{ idea.short }}</span>
                        </router-link>

                        <p class="summary"> &nbsp; {{ idea.long }} </p>
                    </div>
                    <br>
                    <button class="button is-danger is-small" @click="deleteCategory"> Delete this category </button>
                </nav>
                </div>
            </div>
        </section>

  </div>
  <span v-else >
      loading
  </span>
</template>

<script>
import { db, auth } from '@/firebaseConfig'

export default {
    name:"categoriesView",
    props:["categoryId"],
    data:function(){
        return {
            data: false,
            deleting: false,
            newIdea: "",
        }
    },
    computed: {
        filterByCategory() {
            return this.ideas.filter((item) => item.category == this.data.name);
        },
    },
    methods: {
        deleteCategory: function() {
            this.data = false
            this.deleting = true
            alert("Successfully Deleted!")
            this.$firestoreRefs.data.delete().then(()=>{
                this.$router.push("/todos")
            });
        },
        addIdea: function() {
            db.collection('todoList').add({
                checked: false,
                short: this.newIdea,
                long: 'No summary',
                owner: auth.currentUser.uid,
                date: new Date(),
                category: this.data.name
            }).then( ref => {
                // I'm not 100% sold on this -- it's a bit ... weird. Might be worth going to a loading screen for a flash
                // doing nothing and waiting, however, isn't good.
                this.$router.push({name:'ideaView', params:{ideaId:ref.id}})
            });
        },
    },
    firestore: function() {
        return {
            ideas: db.collection('todoList')
                     .where('owner', '==', auth.currentUser.uid)
                     .orderBy('date', 'desc'),
            data: db.collection("categories")
                    .doc(this.categoryId),
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
.line-through {
  text-decoration: line-through;
}
.summary {
    white-space: nowrap;
    overflow: hidden;
}
</style>