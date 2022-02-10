<template>
  <v-form>
    <v-text-field
      v-model.number="editedItem.tagNumber"
      label="Tag Number"
      outlined
      dense
    />
    <v-text-field
      v-model="editedItem.tagHolderId"
      label="Tag Holder Name"
      outlined
      dense
    />
    <v-text-field
      v-model="editedItem.thirdPartyName"
      label="Third Party Name"
      outlined
      dense
    />
    <datetime-picker
      v-model="editedItem.tagInTime"
      label="Tag In Time"
    ></datetime-picker>
  </v-form>
</template>
<script>
export default {
  name: 'AddTag',
}
</script>
