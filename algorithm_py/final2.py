import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime

# Get current time
current_time = datetime.now()
current_time_str = current_time.strftime("%H:%M - %d/%m/%Y")

# Path to your service account key file
cred = credentials.Certificate("C:/Users/vusu3/Desktop/ApiKey/api.json")

# Check if the app with the name "databaseVux" is already initialized
if not firebase_admin._apps:
    # Initialize Firebase with the app name "databaseVux"
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://schooldatabase-63900-default-rtdb.firebaseio.com/'
    }, name="databaseVux")

# Reference the root of the database
ref = db.reference("teachers", app=firebase_admin.get_app("databaseVux"))

# Function to update time_in or time_out
def update_time(id_input, in_out, room_ID, time_input):
    teachers_data = ref.get()
    
    for teacher_key, teacher in teachers_data.items():
        room_data = teacher.get(room_ID)
        if room_data:
            access_time = room_data['access_time']
            start_time, end_time = access_time.split('-')
            start_time = datetime.strptime(start_time, "%H:%M").time()
            end_time = datetime.strptime(end_time, "%H:%M").time()
            current_time = datetime.strptime(time_input, "%H:%M - %d/%m/%Y").time()
            
            # Check if the ID belongs to the teacher
            if teacher['ID'] == id_input:
                if start_time <= current_time <= end_time:
                    if in_out.lower() == 'in':
                        room_data['time_in'].append(time_input)
                        ref.child(teacher_key).child(room_ID).child('time_in').set(room_data['time_in'])
                        print(f"Teacher {id_input}'s time_in updated to {time_input} in {room_ID}.")
                    elif in_out.lower() == 'out':
                        room_data['time_out'].append(time_input)
                        ref.child(teacher_key).child(room_ID).child('time_out').set(room_data['time_out'])
                        print(f"Teacher {id_input}'s time_out updated to {time_input} in {room_ID}.")
                    else:
                        print("Invalid input for in_out. Please use 'in' or 'out'.")
                    
                    room_data['time_record'].append(f"{time_input} - {id_input}")
                    ref.child(teacher_key).child(room_ID).child('time_record').set(room_data['time_record'])
                    return
                else:
                    print(f"Access denied for teacher {id_input} to {room_ID} at {time_input}. Outside of access time {access_time}.")
                    return
            
            # Check if the ID belongs to a student
            if 'student_list' in room_data:
                for index, student in enumerate(room_data['student_list']):
                    if student['Student_ID'] == id_input:
                        if start_time <= current_time <= end_time:
                            if in_out.lower() == 'in':
                                student['time_in'].append(time_input)
                                ref.child(teacher_key).child(room_ID).child('student_list').child(str(index)).child('time_in').set(student['time_in'])
                                print(f"Student {id_input}'s time_in updated to {time_input} in {room_ID}.")

                                # Move student from unaccess to accessed and include name
                                for idx, unaccessed_student in enumerate(room_data['unaccess']):
                                    if unaccessed_student['Student_ID'] == id_input:
                                        room_data['unaccess'].pop(idx)
                                        room_data['accessed'].append(f"{id_input} - {student['name']} - {current_time_str}")
                                        break

                                ref.child(teacher_key).child(room_ID).child('unaccess').set(room_data['unaccess'])
                                ref.child(teacher_key).child(room_ID).child('accessed').set(room_data['accessed'])

                            elif in_out.lower() == 'out':
                                student['time_out'].append(time_input)
                                ref.child(teacher_key).child(room_ID).child('student_list').child(str(index)).child('time_out').set(student['time_out'])
                                print(f"Student {id_input}'s time_out updated to {time_input} in {room_ID}.")
                            else:
                                print("Invalid input for in_out. Please use 'in' or 'out'.")

                            room_data['time_record'].append(f"{time_input} - {id_input}")
                            ref.child(teacher_key).child(room_ID).child('time_record').set(room_data['time_record'])
                            return
                        else:
                            print(f"Access denied for student {id_input} to {room_ID} at {time_input}. Outside of access time {access_time}.")
                            return
        print(f"ID {id_input} not found in the database.")


# Example inputs
id_input = 12343124  # Assign the ID directly as an integer (could be a teacher or a student)
in_out = 'in'  # Specify 'in' or 'out'
room_ID = 'Room_2'  # Specify the room ID
time_input = current_time_str  # Update time based on the input

# Update time based on the input
update_time(id_input, in_out, room_ID, time_input)
