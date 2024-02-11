<script setup>

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
});

</script>

<template>
    <fieldset class="fieldset-border" :class="{'disabled': props.disabled}">
        <legend class="fieldset-border">{{ title }}</legend>
        <slot></slot>
    </fieldset>
</template>

<style lang="scss" scoped>
    fieldset.fieldset-border {
        border: 1px solid rgb(201, 199, 199) !important;
        padding: 0.6em !important;
        border-radius: 5px;
        /* margin: 0 0 1.5em 0 !important; */


        &.disabled {
          // background-color: #e3e5e8;
          background: rgb(227,229,232);
          background: linear-gradient(90deg, rgba(227,229,232,0.7458333675266982) 18%, rgba(227,229,232,0.7682423311121324) 62%);
        }
    }

    legend.fieldset-border {
      background: white;
      color: black;
      /* padding: 2px 4px ; */
      font-size: 0.8rem;
      font-weight: bold;
      border-radius: 3px;
      box-shadow: 0 0 0 0px #ddd;
      margin-left: 0px;
      text-transform: uppercase;
        
    }
 </style>
