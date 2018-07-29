<template>
    <div class="quill-editor-example">
        <!-- quill-editor -->
        <quill-editor v-model="content" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
            <div :id="toolbarName" slot="toolbar">
                <!-- Add a bold button -->
                <button class="ql-bold">Bold</button>
                <button class="ql-italic">Italic</button>
                <!-- Add font size dropdown -->
                <select class="ql-size">
                    <option value="small"></option>
                    <!-- Note a missing, thus falsy value, is used to reset to default -->
                    <option selected></option>
                    <option value="large"></option>
                    <option value="huge"></option>
                </select>
                <select class="ql-font">
                    <option selected="selected"></option>
                    <option value="serif"></option>
                    <option value="monospace"></option>
                </select>
            </div>
        </quill-editor>
    </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
    components: {
        quillEditor
    },
    props: {
        toolbarName: {
            type: String,
            default: "toolbar"
        },
        parentsContent: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            content: "",
            editorOption: {
                modules: {
                    toolbar: "#" + this.toolbarName
                }
            }
        };
    },
    created() {
        this.content = this.parentsContent;
    },
    watch: {
        parentsContent: function(val) {
            this.content = val;
        }
    },
    methods: {
        onEditorBlur(editor) {
            // console.log('editor blur!', editor)
        },
        onEditorFocus(editor) {
            // console.log('editor focus!', editor)
        },
        onEditorReady(editor) {
            // console.log('editor ready!', editor)
        }
    }
};
</script>

<style lang="scss" >
.quill-editor {
    width: 100%;
    float: left;
}
.ql-snow .ql-picker-label::before {
    position: absolute;
}
</style>