/*
    this button has been created only for testing purposes
    it allows to sign out from the app easily during development
*/

import { Pressable, StyleSheet, Text } from 'react-native'
import React from 'react'
import { supabase } from '@/lib/supabase';


const OnlyForTestSignOutButton = () => {
  return (
    <Pressable style={styles.container} onPress={() => supabase.auth.signOut()}  >
        <Text style={styles.text}>Sign Out</Text>
        </Pressable>
    
    

  )
}

export default OnlyForTestSignOutButton

const styles = StyleSheet.create({
container: {
    marginTop: 20,
    backgroundColor: 'red',
    padding: 15,
    alignItems: 'center',
    borderRadius: 100,
    marginVertical: 10  
},
text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  }
})