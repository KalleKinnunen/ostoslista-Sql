import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, Button, Alert, Keyboard } from 'react-native';
import * as SQLite from'expo-sqlite';

export default function App() {

const [product, setProduct] = useState('');
const [amount, setAmount] = useState('');
const [shoppings, setShoppings] = useState([]);

const db = SQLite.openDatabase('shoppingdb.db');


useEffect(() => {
  db.transaction(tx => {
    tx.executeSql(`create table if not exists shopping (id integer primary key not null, product text, amount text);`);
  }, null, updateList);
}, []);

const saveProduct = () => {
  db.transaction(tx => {
    tx.executeSql(`insert into shopping (product, amount) values (?, ?);`,
      [product, amount]);
  }, null, updateList)
}

const updateList = () => {
  db.transaction(tx => {
    tx.executeSql(`select * from shopping;`, [], (_, { rows }) => 
    setShoppings(rows._array)
    );
  }, null, null);
}

const deleteProduct = (id) => {
  db.transaction(tx => {
      tx.executeSql(`delete from shopping where id = ?;`, [id]);
    }, null, updateList);
}

const listSeparator = () => {
  return(
    <View
      style={{
        height: 5,
        width: '80%',
        backgroundColor: '#fff',
        marginLeft: '10%'
      }}
    />
  );
};

  return (
    <View style={styles.container}>
      
      <TextInput
        style={ styles.input }
        keyboardType='default'
        onChangeText={ product => setProduct(product) }
        value={ product }
        placeholder='Product'/>

      <TextInput
        style={ styles.input }
        keyboardType='default'
        onChangeText={ amount => setAmount(amount) }
        value={ amount }
        placeholder='Amount'/>

      <View style={ styles.button }>
        <Button title='Save'
          onPress={ saveProduct } />
      </View>

      <Text>Shopping list</Text>

      <FlatList
        style={ styles.list }
        keyExtractor={ item => item.id.toString() }
        renderItem={ ({ item }) => 
        <View style={ styles.listcontainer }>
          <Text>
            { item.product }
            <Text>, </Text>
            { item.amount }
          </Text>
          <Text style={{ color: '#0000ff' }}onPress={() => deleteProduct(item.id)}>Bought</Text>
            </View> }
      data={ shoppings }
      ItemSeparatorComponent={ listSeparator }/>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 25,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 90
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});