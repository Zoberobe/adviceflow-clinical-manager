# 🏥 AdviceFlow - Clinical Task Manager

AdviceFlow é uma aplicação web completa desenvolvida para a gestão eficiente de protocolos e tarefas em ambientes hospitalares. Médicos e enfermeiros podem criar, categorizar, delegar e rastrear tarefas clínicas com um alto grau de confiabilidade, segurança e usabilidade.

---

## 🚀 Tecnologias e Arquitetura

O projeto adota uma separação clara entre Frontend e Backend, seguindo rigorosamente os princípios **SOLID**, **DRY** e **KISS**:

**Backend (API REST):**
* **Python + Django REST Framework (DRF)**
* **Autenticação:** JWT (JSON Web Tokens) com rotação e renovação automática transparente de token.
* **Banco de Dados:** PostgreSQL 15.
* **Boas Práticas:** Resolução do problema de *N+1 Queries* no DRF e separação da lógica de comunicação com APIs de terceiros utilizando a camada de *Service* (ex: `PatientService`).

**Frontend:**
* **React + Vite**
* **Estilização:** TailwindCSS para um design corporativo e utilitário.
* **Arquitetura:** Padrão de *Single Responsibility Principle* (SRP) aplicado com a extração de modais e cards em componentes reutilizáveis.
* **Resiliência de Rede:** Axios Interceptors configurados para garantir excelente UX, interceptando tokens expirados para renovar a sessão em segundo plano, sem deslogar o médico no meio do plantão.

**Infraestrutura e Deploy:**
* **Docker e Docker Compose**
* Integração Contínua (CI) via **GitHub Actions**

---

## ⚙️ Como rodar o projeto localmente

**Pré-requisitos:** Ter o **Docker** e o **Docker Compose** instalados na sua máquina.

**1. Clone o repositório:**
```bash
git clone https://github.com/Zoberobe/adviceflow-clinical-manager
cd adviceflow-clinical-task-manager
```

**2. Suba os containers da aplicação:**
```bash
docker-compose up --build -d
```

**3. Acesse a aplicação:**
* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:8000/api/](http://localhost:8000/api/)

*(Opcional) Para criar um superusuário no Django e acessar o painel administrativo em http://localhost:8000/admin, execute:*
```bash
docker-compose exec backend python manage.py createsuperuser
```

---

## 🧪 Testes e Qualidade de Código (CI/CD)

* **Backend (Pytest):** Cobertura de autenticação, bloqueio de permissões cruzadas (garantindo que um delegado não possa deletar um protocolo original) e *Mock* de serviços externos (API de simulação de pacientes).
* **Frontend (Selenium):** Script de fluxo de testes automatizados E2E validando a jornada autônoma do usuário (Login e Dashboard).
* **CI/CD Pipeline:** Configurado com **GitHub Actions** (`.github/workflows/ci.yml`) para checar o repositório, instalar dependências, compilar o frontend e rodar os testes em ambientes isolados a cada novo *push* ou *Pull Request*.

---

## 📌 Decisões de Design (O que brilha neste projeto)

* **Integração Externa Mockada e Isolada:** O consumo da API pública (`randomuser.me`) é feito de forma segura e elegante através da camada `PatientService`, garantindo responsabilidade única na `View` e testes totalmente previsíveis e rápidos.
* **Performance Extrema (N+1 Resolvido):** O DRF foi ajustado com a função `.select_related()` para evitar que consultas de chaves estrangeiras saturem o banco de dados durante a renderização da listagem de protocolos.
* **Segurança de JWT Avançada:** O frontend foca na melhor experiência do usuário: ele não desloga a conta bruscamente se o token de acesso expirar. A interceptação inteligente do Axios tenta comunicar com a rota de renovação (usando o *refresh_token*) de forma totalmente transparente e em segundo plano.