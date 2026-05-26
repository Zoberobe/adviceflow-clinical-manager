# 🏥 AdviceFlow - Clinical Task Manager

**🟢 Live Demo (AWS EC2):** [http://54.20.64.160:5173](http://54.20.64.160:5173)

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
* **Deploy Cloud:** Hospedado na AWS (Amazon Web Services) em uma instância EC2.

---

## ⚙️ Como rodar o projeto localmente

**Pré-requisitos:** Ter o **Docker** e o **Docker Compose** instalados na sua máquina.

**1. Clone o repositório:**
```bash
git clone https://github.com/Zoberobe/adviceflow-clinical-manager
cd adviceflow-clinical-manager
```

**2. Configure as Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz do projeto contendo as seguintes credenciais:
```env
# Backend
SECRET_KEY=sua_chave_secreta_aqui
DEBUG=True

# Frontend
VITE_API_URL=http://localhost:8000
```

**3. Suba os containers da aplicação:**
```bash
docker-compose up --build -d
```

**4. Acesse a aplicação:**
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

---

## ☁️ Deploy AWS

A aplicação foi integralmente publicada na AWS usando instâncias EC2, demonstrando conhecimento full-stack e cloud. O ambiente remoto orquestra o banco de dados PostgreSQL, o backend Django e o frontend Vite (React) simultaneamente via containers Docker.

Para testar ao vivo, acesse o link no topo deste README.


> **⚠️ Nota de Auditoria de Segurança:**
> Este repositório passou por uma auditoria de segurança rigorosa em maio de 2026 para remediar a exposição acidental de credenciais de infraestrutura. Todas as chaves expostas foram permanentemente revogadas e alteradas no ambiente de nuvem. O histórico de commits foi mantido para preservar a integridade e a transparência do processo de desenvolvimento.