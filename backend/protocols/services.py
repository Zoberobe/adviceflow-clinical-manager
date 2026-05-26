import urllib.request
import json

class PatientService:
    @staticmethod
    def get_random_patient():
        url = "https://randomuser.me/api/?inc=name,dob,picture&nat=br"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            user_data = data['results'][0]
            
            patient = {
                "full_name": f"{user_data['name']['first']} {user_data['name']['last']}",
                "age": user_data['dob']['age'],
                "photo_url": user_data['picture']['thumbnail'],
                "clinical_status": "Aguardando Triagem" 
            }
            return patient