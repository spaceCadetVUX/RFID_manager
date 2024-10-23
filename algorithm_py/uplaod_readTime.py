import firebase_admin
from firebase_admin import credentials, db

# creae structure and clear all data

# Path to your service account key file
cred = credentials.Certificate("C:/Users/vusu3/Desktop/ApiKey/api.json")

# Check if the app with the name "databaseVux" is already initialized
if not firebase_admin._apps:
    # Initialize Firebase with the app name "databaseVux"
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://schooldatabase-63900-default-rtdb.firebaseio.com/'
    }, name="databaseVux")

# Define the teacher data structure
teacher_data = {
    'ID': 134231,
    'name': 'Taylor Swift',
    'UID': '86g0QY9K1Xc3CqOaQ6MUO9nu5472',
    'Room_1': {  # Added colon here
         'date':'10/15/2024',# MM/DD/YYYY
        'access_time': '09:10-21:03',
        'doorStatus': False,
        'time_record':['placeholder'],
        'time_in': ['placeholder'],
        'time_out': ['placeholder'],
        'accessed':['placeholder'],
        'unaccess':[
              {'Student_ID': 23423423, 'time_in': ['placeholder'],'name':'Olivia'},
              {'Student_ID': 34523453, 'time_in': ['placeholder'],'name':'Jack'},
              {'Student_ID': 26434823, 'time_in': ['placeholder'],'name':'Mason'},
              {'Student_ID': 26434823, 'time_in': ['placeholder'],'name':'Ethan'},
              {'Student_ID': 23543745, 'time_in': ['placeholder'],'name':'Mia'},
              {'Student_ID': 87677642, 'time_in': ['placeholder'],'name':'Sophia'},
              {'Student_ID': 12312323, 'time_in': ['placeholder'],'name':'Isabella'},
            ],
        
        'student_list': [
            {'Student_ID': 23423423, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Olivia'},
            {'Student_ID': 34523453, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Jack'},
            {'Student_ID': 26434823, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Mason'},
            {'Student_ID': 26434823, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Ethan'},
            {'Student_ID': 23543745, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Mia'},
            {'Student_ID': 87677642, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Sophia'},
            {'Student_ID': 12312323, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Isabella'},
        ]
    },
    'Room_2': {  # Added colon here
        'date':'10/15/2024',
        'access_time': '09:10-20:00',
        'doorStatus': False,
        'time_record':['placeholder'],
        'time_in': ['placeholder'],
        'time_out': ['placeholder'],
        'accessed':['placeholder'],
        'unaccess':[
            {'Student_ID': 12343124, 'time_in': ['placeholder'],'name':'Charlotte'},
            {'Student_ID': 68798989, 'time_in': ['placeholder'],'name':'Chloe'},
            {'Student_ID': 67878788, 'time_in': ['placeholder'],'name':'Isabella'},
            {'Student_ID': 32453245, 'time_in': ['placeholder'],'name':'Lily'},
            {'Student_ID': 32456322, 'time_in': ['placeholder'],'name':'Benjamin'},
            {'Student_ID': 67064867, 'time_in': ['placeholder'],'name':'Ava'},
            {'Student_ID': 69788567, 'time_in': ['placeholder'],'name':'Mason'},
            ],
        'student_list': [
            {'Student_ID': 12343124, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Charlotte'},
            {'Student_ID': 68798989, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Chloe'},
            {'Student_ID': 67878788, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Isabella'},
            {'Student_ID': 32453245, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Lily'},
            {'Student_ID': 32456322, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Benjamin'},
            {'Student_ID': 67064867, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Ava'},
            {'Student_ID': 69788567, 'time_in': ['placeholder'], 'time_out': ['placeholder'],'name':'Mason'},
        ]
    }
}


# Reference the root of the database or a specific path where you want to store the data
ref = db.reference(app=firebase_admin.get_app("databaseVux"))

# Set the teacher data at a specific location in the database
ref.child('teachers').child('86g0QY9K1Xc3CqOaQ6MUO9nu5472').set(teacher_data)

print('Teacher data uploaded successfully')
