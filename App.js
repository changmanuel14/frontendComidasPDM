import * as React from 'react';
import {useState, useEffect }from "react";
import { View, Text, Button, StyleSheet, StatusBar, Alert, Modal, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const Stack = createStackNavigator();

function App() {
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [comidas, setComidas] = useState([]);
  const [iduser, setIduser] = useState("");
  const [idcategoria, setIdcategoria] = useState("");
  const [categoria, setCategoria] = useState("");
  const [us, setUs] = useState("");

  function consumirApi(){
    fetch('http://192.168.0.160:3001/categorias')
    .then( res => res.json())
    .then( datos => {
      //console.log(datos)
      setCategorias(datos)
      //console.log(categorias)
    } )
    .catch( error=> {
      console.log(error)
      Alert.alert("No hay conexion")
    })
  }

  function obtenerusers(){
    fetch('http://192.168.0.160:3001/users')
    .then( res => res.json())
    .then( datos => {
      //console.log(datos)
      setUsuarios(datos)
    } )
    .catch( error=> {
      console.log(error)
      Alert.alert("No hay conexion")
    })
  }

  function obtenercomidas(id){
    let cadena = 'http://192.168.0.160:3001/categorias/' + id
    console.log(cadena)
    fetch(cadena)
    .then( res => res.json())
    .then( datos => {
      //console.log(datos)
      setComidas(datos)
    } )
    .catch( error=> {
      console.log(error)
      Alert.alert("No hay conexion")
    })
  }

  function agregarUser(user, pwd){
    fetch('http://192.168.0.160:3001/user', {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        { user: user, pwd: pwd }
      )
    })
    .then( res=>res.text()
    .then( res=>{
      //console.log(res)
      Alert.alert("Usuario agregado exitosamente")
    } )
    .catch(error=>console.log('Error aqui' + error))
    )
  }

  function agregarCategoria(Nombre){
    fetch('http://192.168.0.160:3001/categoria', {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        { Nombre: Nombre }
      )
    })
    .then( res=>res.text()
    .then( res=>{
      //console.log(res)
      Alert.alert("Categoria agregada exitosamente")
    } )
    .catch(error=>console.log('Error aqui' + error))
    )
  }

  function agregarComida(descripcion, id_categoria, id_usuario, fotografia){
    fetch('http://192.168.0.160:3001/comida', {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        { descripcion: descripcion, id_categoria: id_categoria, id_usuario: id_usuario, fotografia: fotografia }
      )
    })
    .then( res=>res.text()
    .then( res=>{
      //console.log(res)
      Alert.alert("Comida agregada exitosamente")
    } )
    .catch(error=>console.log('Error aqui' + error))
    )
  }

  function obtenerusers(){
    fetch('http://192.168.0.160:3001/users')
    .then( res => res.json())
    .then( datos => {
      //console.log(datos)
      setUsuarios(datos)
      //console.log(usuarios)
    } )
    .catch( error=> {
      console.log(error)
      Alert.alert("No hay conexion")
    })
  }

  function Login({ navigation }) {
    const [user, setUser] = useState("")
    const [pwd, setPwd] = useState("")
    const [mes, setMes] = useState("")
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={estilos.titulo}>Login</Text>
        <Text style={estilos.texto}>Usuario</Text>
        <TextInput style={estilos.input} defaultValue={user} onChangeText={(text)=>{setUser(text)}}></TextInput>
        <Text style={estilos.texto}>Clave</Text>
        <TextInput style={estilos.input} defaultValue={pwd} onChangeText={(text)=>{setPwd(text)}}></TextInput>
        <Text style={estilos.texto}>{mes}</Text>
        <Button
          title="Ingresar"
          onPress={() => {
            obtenerusers()
            console.log(usuarios)
            let correcto = false;
            let numusuarios = usuarios.length
            for(var i = 0; i<numusuarios; i++){
              if(user == usuarios[i].user) {
                  if(pwd == usuarios[i].pwd){
                      correcto = true
                      setIduser(usuarios[i].id)
                      setUs(usuarios[i].user)
                      console.log(iduser)
                  }
              }
            }

            if(correcto == true){
              consumirApi()
              navigation.navigate('Listar')
            }else{
              setMes("Error, intente de nuevo")
            }
            }
          }
        />
        <Button
          title="Crear nuevo usuario"
          onPress={() => {
            navigation.navigate('Registro')
            }
          }
        />
      </View>
    );
  }
  
  function Listar({ navigation }) {
    return (
      <ScrollView>
        <View style={estilos.container}>
        <StatusBar style="auto" />
        <Text>Id: {iduser}</Text>
        <Text>Nombre: {us}</Text>
        <Text style={estilos.titulo}>Listado Categorias</Text>
        <Button
              title="Nueva categoria"
              onPress={() => { 
                navigation.navigate('Nuevacategoria')
            }
          }
        />
        { categorias.map( p=>(
          <View>
            <Text style={estilos.texto} key={p.Id}>{p.Id} {p.Nombre}</Text>
            <Button
              title="Ver reseñas"
              onPress={() => {
                setIdcategoria(p.Id) 
                setCategoria(p.Nombre)
                console.log(idcategoria)
                obtenercomidas(idcategoria) 
                navigation.navigate('Listarcomida')
            }
          }
        />
          </View>
          
        )) }
      </View>
      </ScrollView>
      
    )
  }

  function Listarcomida({ navigation }) {
    return (
      <ScrollView>
        <View style={estilos.container}>
        <StatusBar style="auto" />
        <Text style={estilos.titulo}>Listado reseñas {categoria}</Text>
        <Button
              title="Nueva reseña"
              onPress={() => { 
                navigation.navigate('Nuevacomida')
            }
          }
        />
        { comidas.map( p=>(
          <View>
            <Text style={estilos.texto}>Descripcion: {p.descripcion}</Text>
            <Text style={estilos.texto}>Usuario:{p.user}</Text>
            <Text style={estilos.texto}>Fecha de Creacion:{p.fechaCreacion}</Text>
            <Image source={{ uri: p.fotografia }} style={{ width: 300, height: 300 }} />
            <Text>            </Text>
            <Text>            </Text>
            <Text>            </Text>
            <Text>==============================================</Text>
          </View>
          
        )) }
      </View>

      </ScrollView>
      
    )
  }
  
  function Registro({ navigation }) {
    const [user, setUser] = useState("")
    const [pwd, setPwd] = useState("")
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={estilos.titulo}>Registro</Text>
        <Text style={estilos.texto}>Usuario</Text>
        <TextInput style={estilos.input} defaultValue={user} onChangeText={(text)=>{setUser(text)}}></TextInput>
        <Text style={estilos.texto}>Clave</Text>
        <TextInput style={estilos.input} defaultValue={pwd} onChangeText={(text)=>{setPwd(text)}}></TextInput>
        <Button
          title="Guardar"
          onPress={() => {
            agregarUser(user, pwd)
            navigation.navigate('Login')
            }
          }
        />
      </View>
    );
  }

  function Nuevacategoria({ navigation }) {
    const [cat, setCat] = useState("")
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={estilos.titulo}>Nueva categoria</Text>
        <Text style={estilos.texto}>Categoria</Text>
        <TextInput style={estilos.input} defaultValue={cat} onChangeText={(text)=>{setCat(text)}}></TextInput>
        <Button
          title="Guardar"
          onPress={() => {
            agregarCategoria(cat)
            navigation.navigate('Listar')
            }
          }
        />
      </View>
    );
  }

  function Nuevacomida({ navigation }) {
    const [descripcion, setDescripcion] = useState("")
    const [image, setImage] = useState(null);

    useEffect(() => {
      (async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }, []);

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      //console.log(result);

      if (!result.cancelled) {
        setImage(result.uri);
        console.log(result.uri)
      }
    };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={estilos.titulo}>Nueva comida</Text>
        <Text style={estilos.texto}>Comida</Text>
        <TextInput style={estilos.input} defaultValue={descripcion} onChangeText={(text)=>{setDescripcion(text)}}></TextInput>
      <Button title="Selecciona una imagen " onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />}
      <Button
          title="Guardar"
          onPress={() => {
            agregarComida(descripcion, idcategoria, iduser, image)
            navigation.navigate('Listar')
            }
          }
        />
    </View>
  );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Listar" component={Listar} />
        <Stack.Screen name="Listarcomida" component={Listarcomida} />
        <Stack.Screen name="Nuevacategoria" component={Nuevacategoria} />
        <Stack.Screen name="Nuevacomida" component={Nuevacomida} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontSize: 25
  },
  titulo: {
    fontSize: 50
  },
  input: {
    borderWidth: 1,
    borderColor: 'blue',
    alignSelf: 'stretch',
    margin: 15,
    height: 35,
    fontSize: 20,
  },
  modalView:{
    position:"absolute",
    bottom:2,
    width:"100%",
    backgroundColor:"white"

},
modalButtonView:{
    flexDirection:"row",
    justifyContent:"space-around",
    padding:10
},
inputStyle:{
  margin:5
},
});