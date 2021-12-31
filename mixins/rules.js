export default {
  name: 'rules',
  data() {
    return {
      required: (v) => !!v || 'Required.',
      min8: (v) => v.length >= 8 || 'Min 8 characters',
      min4: (v) => v.length >= 4 || 'Min 4 characters',
      max6: (v) => v.length <= 6 || 'Max 6 characters',
      email: (v) => /.+@.+\..+/.test(v) || 'Invalid e-mail',
    }
  },
}
