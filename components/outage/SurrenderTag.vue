<template>
  <form>
    <v-form>
      <datetime-picker
        v-model="editedItem.tagOutTime"
        label="Tag Out Time"
      ></datetime-picker>

      <datetime-picker
        v-model="editedItem.timeIn"
        label="Time In"
      ></datetime-picker>

      <v-textarea
        v-model="editedItem.cause"
        label="Cause"
        outlined
        dense
        height="100px"
      />
      <v-textarea
        v-model="editedItem.resolution"
        label="Resolution"
        outlined
        dense
        height="100px"
      />
      <v-text-field
        v-model="editedItem.staffNameTCN"
        label="TCN Staff Name"
        outlined
        dense
      />
    </v-form>
  </form>
</template>
<script>
export default {
  name: 'SurrenderTag',
}
</script>
