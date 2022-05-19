<template>
    <div v-if="ideas===false">
        loading
    </div>

    <div v-else>
        <section class="section m-auto">
            <div class="columns is-centered">
                <div class="column is-half">
                <nav class="panel is-success">
                    <p class="panel-heading">{{usrname}}'s Incomplete To-do Items</p>
                    <div class="panel-block">
                    <div class="block m-auto">
                        <div class="field is-grouped">
                        <div class="control is-expanded">
                            <input v-model="newIdea" placeholder="add new to-do item" class="input is-success" type="text" @keyup.enter="addIdea"/>
                        </div>
                        <div class="control">
                            <button class="button is-primary" @click="addIdea">+</button>
                        </div>
                        </div>
                    </div>
                    </div>
                
                            
                    <div class="panel-block" v-for="idea in inCompleteTodoList" :key="idea.id">
                
                        <input type="checkbox" @click="updateStatus(idea.id)" v-model="idea.checked" />

                        <router-link :to="{name:'ideaView', params:{ideaId:idea.id}}">
                            <span class="tag is-success is-light">{{ idea.short }}</span>
                        </router-link>

                        <p class="summary"> &nbsp; {{ idea.long }} </p>
                    </div>
                
                </nav>
                </div>
            </div>
        </section>


        <section class="section">
        <div class="container">
            <div class="columns is-centered">
                <div class="column is-half">
                    <ul class="tags">
                        Categories:
                        <li v-for="category in categories" :key="category.id">
                            <router-link :to="{name:'categoriesView', params:{categoryId:category.id}}">
                                <span class="tag is-info is-light" style="margin:3px">
                                    {{ category.name }}
                                </span>
                            </router-link>
                        </li>
                    </ul>
                <div>             
            </div>

            <div class="field has-addons">
                <input class="input is-info is-small" v-model="newCategory" placeholder="add a new category" @keyup.enter="addCategory"/>
                <button class="button is-info is-small" @click="addCategory">+</button>
            </div>


            </div>
            </div>
        </div>
        </section>

        
</div>

</template>

<script>
import { db, auth } from '@/firebaseConfig'

export default {
    data: function() {
        return {
            ideas: false,
            newIdea: "",
            usrname: auth.currentUser.displayName,
            newCategory: "",
            categories: false
        }
    },
    computed: {
        completeTodoList() {
            return this.ideas.filter((item) => item.checked);
        },
        inCompleteTodoList() {
            return this.ideas.filter((item) => !item.checked);
        },
    },
    firestore: function() {
        return {
            ideas: db.collection('todoList')
                     .where('owner', '==', auth.currentUser.uid)
                     .orderBy('date', 'desc'),
            categories: db.collection('categories')
                          .where('owner', '==', auth.currentUser.uid)
        }
    },
    methods: {
        addIdea: function() {
            db.collection('todoList').add({
                checked: false,
                short: this.newIdea,
                long: 'No summary',
                owner: auth.currentUser.uid,
                date: new Date(),
                category: 'None'
            }).then( ref => {
                // I'm not 100% sold on this -- it's a bit ... weird. Might be worth going to a loading screen for a flash
                // doing nothing and waiting, however, isn't good.
                this.$router.push({name:'ideaView', params:{ideaId:ref.id}})
            });
        },
        updateStatus: function(id) {
            db.collection('todoList').doc(id).update({checked: true})
        },
        addCategory: function() {
            db.collection('categories').add({
                name: this.newCategory,
                owner: auth.currentUser.uid,
                items: []
            }).then( ref => {
                // I'm not 100% sold on this -- it's a bit ... weird. Might be worth going to a loading screen for a flash
                // doing nothing and waiting, however, isn't good.
                this.$router.push({name:'categoriesView', params:{categoryId:ref.id}})
            });
        },
    }
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