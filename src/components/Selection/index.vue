<script lang="ts" setup>
import { ref, watch } from "vue"

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: [String, Number],
    default: ""
  }
})
const emit = defineEmits(["update:modelValue"])

const selected = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    selected.value = val
  }
)

watch(selected, (val) => {
  emit("update:modelValue", val)
})
</script>

<template>
  <el-select v-model="selected">
    <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label" />
  </el-select>
</template>

<style lang="scss" scoped></style>
