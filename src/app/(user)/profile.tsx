import { supabase } from '@/lib/supabase'
import { StyleSheet, Text, View, Button } from 'react-native'

const ProfileScreen = () => {
  return (
    <View>
      <Text>Profile</Text>
      <Button title="Sign Out" onPress={() => supabase.auth.signOut()}/>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})