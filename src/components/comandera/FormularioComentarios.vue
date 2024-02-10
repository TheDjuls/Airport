<template>
    <div>
        <v-dialog v-model="mostrarModal" persistent width="1024">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Añadir Comentario</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-textarea clearable clear-icon="mdi-close-circle" label="Comentario"
                                    v-model="nuevoComentario"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="danger" variant="text" @click="closeModal()">
                        Cancelar
                    </v-btn>
                    <v-btn color="primary" variant="text" @click="guardarComentario()">
                        Guarda Comentario
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import emitter from '@/plugins/mitt';
import { toRefs, ref } from 'vue'
export default {
    props: {
        abrirComentarios: {
            type: Boolean,
            required: true,
        },
        producto: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const nuevoComentario = ref("");
        const { abrirComentarios: mostrarModal, producto: productoEditar } = toRefs(props);

        const closeModal = () => {
            emitter.emit('closeModalComentarios');
        }

        const guardarComentario = () => {
            emitter.emit('guardarComentarios',{comentario: nuevoComentario.value});
            nuevoComentario.value = ""
        }

        return {
            guardarComentario,
            closeModal,
            mostrarModal,
            productoEditar,
            nuevoComentario
        }
    }
}
</script>
<style scoped></style>