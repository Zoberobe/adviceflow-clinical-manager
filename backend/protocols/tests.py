import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from .models import Category, Protocol
from unittest.mock import patch

pytestmark = pytest.mark.django_db

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def setup_data():
    creator = User.objects.create_user(username='dr_house', password='password123')
    delegate = User.objects.create_user(username='nurse_joy', password='password123')
    
    category = Category.objects.create(name='Cardiologia', description='Testes do coração')
    
    protocol = Protocol.objects.create(
        title='Avaliação de Risco',
        description='Paciente com dores.',
        category=category,
        creator=creator,
        delegated_to=delegate
    )
    
    return {'creator': creator, 'delegate': delegate, 'category': category, 'protocol': protocol}


def test_unauthenticated_access_is_blocked(client):
    response = client.get('/api/protocols/')
    assert response.status_code == 401

@patch('protocols.services.PatientService.get_random_patient')
def test_random_patient_mocked(mock_get_patient, client, setup_data):
    mock_get_patient.return_value = {
        "full_name": "Paciente Simulado", 
        "age": 45, 
        "photo_url": "", 
        "clinical_status": "Aguardando Triagem"
    }
    
    client.force_authenticate(user=setup_data['creator'])
    response = client.get('/api/patients/random/') 
    
    assert response.status_code == 200
    assert response.data['full_name'] == "Paciente Simulado"
    mock_get_patient.assert_called_once()

def test_delegate_cannot_delete_protocol(client, setup_data):
    protocol_id = setup_data['protocol'].id
    delegate = setup_data['delegate']
    
    client.force_authenticate(user=delegate)
    
    response = client.delete(f'/api/protocols/{protocol_id}/')
    
    assert response.status_code == 403

def test_creator_can_delete_protocol(client, setup_data):
    protocol_id = setup_data['protocol'].id
    creator = setup_data['creator']
    
    client.force_authenticate(user=creator)
    
    response = client.delete(f'/api/protocols/{protocol_id}/')
    
    assert response.status_code == 204