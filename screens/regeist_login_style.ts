import { StyleSheet,Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
       // backgroundColor: '#fff',
       justifyContent:'center',
      },


      title: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color:'white'
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 10,
        paddingBottom: 5,
        width:'100%',
        position: 'relative',
      },
      input: {
        flex: 1, // Ensure the input takes available space
        color: 'white', // Ensure text color is visible
        paddingLeft: 10,
        fontSize: 16,
      },
      warningPopup: {
        position: 'absolute',  // To position the popup above the other components
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        top: -50, // Adjust to position the popup above the input
        left: 0,  // Adjust to position the popup next to the input field
        zIndex: 10,  // Ensures it shows above other elements
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5, // Adds a drop shadow on Android
      },
      warningText: {
        color: 'white',
        fontSize: 12,
      },
      eyeIcon: {
        marginLeft: 10,
        marginRight: 10,
      },
      registerButton: {
        backgroundColor: '#f24527',
        paddingVertical: 15,
        borderRadius: 10,
        marginVertical: 20,
        alignItems: 'center',
      },
      registerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      },
      termsText: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
      },
      link: {
        color: 'black',
        fontWeight: 'bold',
        fontSize:13,
      },
      facebookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b5998',
        paddingVertical: 15,
        borderRadius: 10,
        marginVertical: 10,
        justifyContent: 'center',
        
      },
      facebookButtonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
      },
      googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00224D',
        paddingVertical: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#00224D',
        marginVertical: 10,
        justifyContent: 'center',
      },
      googleButtonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
      },
      signInText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 14,
        color:'white',
      },
})