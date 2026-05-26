from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_login_and_dashboard():
    print("🤖 Iniciando o robô de testes do AdviceFlow...")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)

    try:
        print("🌐 Acessando a tela de Login...")
        driver.get("http://localhost:5173/login")
        driver.maximize_window()
        
        wait = WebDriverWait(driver, 10)

        username_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='text']")))
        password_input = driver.find_element(By.XPATH, "//input[@type='password']")
        submit_button = driver.find_element(By.XPATH, "//button[@type='submit']")

        print("⌨️ Preenchendo credenciais...")
        
        username_input.send_keys("admin") 
        password_input.send_keys("123") 
        
        submit_button.click()

        print("⏳ Aguardando autenticação e carregamento do Dashboard...")
        wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Encerrar Sessão')]")))
        
        print("✅ SUCESSO! O robô validou o fluxo de Login e entrou no sistema de forma autônoma.")
        
        time.sleep(3)

    except Exception as e:
        print(f"❌ Falha no teste: {e}")
    
    finally:
        driver.quit()

if __name__ == "__main__":
    test_login_and_dashboard()