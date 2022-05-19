<template>
    <div v-if="ideas===false">
        loading
    </div>
    <div v-else>

        <section class="section m-auto">
            <div class="columns is-centered">
                <div class="column is-half">
                <nav class="panel is-success">
                    <p class="panel-heading">{{usrname}}'s Complete To-do Items</p>
                
                    <div class="panel-block" v-for="idea in completeTodoList" :key="idea.id">
                
                        <router-link :to="{name:'ideaView', params:{ideaId:idea.id}}">
                            <span :class="{ 'line-through': idea.checked === true }">
                              <span class="tag is-danger is-light">{{ idea.short }}</span>
                            </span>
                        </router-link>

                        <p class="summary"> &nbsp;  {{ idea.long }} </p>
                    </div>
                
                </nav>
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
            usrname: auth.currentUser.displayName
        }
    },
    computed: {
        completeTodoList() {
            return this.ideas.filter((item) => item.checked);
        },
    },
    firestore: function() {
        return {
            ideas: db.collection('todoList')
                     .where('owner', '==', auth.currentUser.uid)
                     .orderBy('date', 'desc'),
        }
    },
    methods: {
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
