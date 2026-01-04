# 🚀 ChuZone DevOps POC - Projet Complet

## 📝 Description
Projet POC DevOps complet avec CI/CD, Infrastructure Kubernetes et GitOps pour l'examen Sesame University.

**Note**: Ce projet utilise uniquement un frontend React (pas de backend ni de base de données).

## 🎯 Objectifs
- ✅ **Phase 1**: CI/CD avec GitHub Actions (5 points)
- ✅ **Phase 2**: Release Management (3 points)  
- ✅ **Phase 3**: Infrastructure Kubernetes avec Terraform (5 points)
- ✅ **Phase 4**: GitOps avec ArgoCD (7 points)

## 📦 Contenu du Package

```
chuzone-devops-project/
├── frontend/                    # Application React
│   ├── src/                    # Code source
│   ├── public/                 # Assets publics
│   ├── Dockerfile              # Image Docker
│   ├── nginx.conf              # Config Nginx
│   └── package.json            # Dependencies
│
├── .github/workflows/          # CI/CD GitHub Actions
│   ├── ci-pr.yml              # Workflow Pull Request
│   └── release-approve.yml     # Workflow Release
│
├── terraform/                  # Infrastructure as Code
│   ├── main.tf                # Config principale
│   ├── variables.tf           # Variables
│   ├── outputs.tf             # Outputs
│   └── scripts/               # Scripts Kubernetes
│       ├── install-k8s-master.sh
│       └── install-k8s-worker.sh
│
├── kubernetes-manifests/       # Manifests Kubernetes
│   ├── namespace.yml          # Namespace examen-26
│   ├── deployment.yml         # Déploiement
│   ├── service.yml            # Service NodePort
│   └── argocd-application.yml # Application ArgoCD
│
└── README.md                   # Ce fichier
```

## 🚀 Guide de Démarrage - ÉTAPE PAR ÉTAPE

### Prérequis

**Comptes nécessaires:**
1. Compte GitHub
2. Compte Docker Hub
3. Compte AWS (avec carte bancaire)
4. Compte DuckDNS (gratuit)

**Logiciels requis:**
```bash
# Node.js (v18+)
node --version

# Docker
docker --version

# Terraform
terraform --version

# AWS CLI
aws --version

# Git
git --version
```

### PHASE 1: Configuration Initiale

#### 1.1 Créer le Repository GitHub

```bash
# 1. Sur GitHub.com, créez un nouveau repository: chuzone-devops
# 2. NE PAS initialiser avec README

# 3. Localement, dans le dossier du projet:
cd chuzone-devops-project
git init
git add .
git commit -m "Initial commit: ChuZone DevOps POC"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/chuzone-devops.git
git push -u origin main
```

#### 1.2 Configurer Docker Hub

```bash
# 1. Connectez-vous sur hub.docker.com
# 2. Allez dans Account Settings → Security
# 3. Créez un New Access Token
# 4. Notez le token (vous ne le reverrez plus!)
```

#### 1.3 Ajouter les Secrets GitHub

```bash
# Sur GitHub, dans votre repo:
# Settings → Secrets and variables → Actions → New repository secret

# Ajoutez:
# - Name: DOCKERHUB_USERNAME, Value: votre-username
# - Name: DOCKERHUB_TOKEN, Value: votre-token
```

### PHASE 2: Tester l'Application Localement

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer en mode développement
npm start
# → Ouvre http://localhost:3000

# Tester
npm test

# Builder pour production
npm run build

# Tester avec Docker
docker build -t chuzone-test .
docker run -p 8080:80 chuzone-test
# → Ouvre http://localhost:8080
```

### PHASE 3: CI/CD avec GitHub Actions

#### 3.1 Créer une Pull Request

```bash
# Créer une branche feature
git checkout -b feature/test-ci

# Faire une modification
echo "// Test CI" >> frontend/src/App.js

# Commit et push
git add .
git commit -m "test: trigger CI pipeline"
git push origin feature/test-ci

# Sur GitHub, créez une Pull Request vers main
```

**Résultat attendu:**
- Le workflow `ci-pr.yml` se lance automatiquement
- Tests s'exécutent
- Image Docker `1.0.0-RC1` est créée et poussée sur Docker Hub

#### 3.2 Merger et Créer la Release

```bash
# Sur GitHub, mergez la Pull Request
# Le workflow `release-approve.yml` se lance automatiquement
```

**Résultat attendu:**
- Image `1.0.0-RC1` retaguée en `1.0.0` et `latest`
- Tag Git `v1.0.0` créé
- Release GitHub créée

### PHASE 4: Infrastructure AWS avec Terraform

#### 4.1 Configurer AWS CLI

```bash
# Installer AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configurer
aws configure
# AWS Access Key ID: VOTRE_ACCESS_KEY
# AWS Secret Access Key: VOTRE_SECRET_KEY
# Default region: eu-west-1
# Default output format: json
```

#### 4.2 Créer une Clé SSH sur AWS

```bash
# Option 1: Via AWS CLI
aws ec2 create-key-pair \
  --key-name chuzone-key \
  --query 'KeyMaterial' \
  --output text > chuzone-key.pem

chmod 400 chuzone-key.pem

# Option 2: Via la console AWS
# EC2 → Key Pairs → Create key pair → Télécharger le .pem
```

#### 4.3 Provisionner l'Infrastructure

```bash
cd terraform

# Créer un fichier terraform.tfvars
cat > terraform.tfvars <<EOF
key_name = "chuzone-key"
aws_region = "eu-west-1"
instance_type = "t2.medium"
EOF

# Initialiser Terraform
terraform init

# Vérifier le plan
terraform plan

# Appliquer (créer l'infrastructure)
terraform apply
# Tapez "yes" pour confirmer

# ⏰ Attendez 5-10 minutes pour la création
```

#### 4.4 Récupérer les IPs

```bash
# Afficher les outputs
terraform output

# Sauvegarder les IPs
export MASTER_IP=$(terraform output -raw master_public_ip)
export WORKER1_IP=$(terraform output -raw worker1_public_ip)
export WORKER2_IP=$(terraform output -raw worker2_public_ip)

echo "Master: $MASTER_IP"
echo "Worker1: $WORKER1_IP"
echo "Worker2: $WORKER2_IP"
```

### PHASE 5: Installation Kubernetes

#### 5.1 Installer sur le Master

```bash
# Se connecter au Master
ssh -i chuzone-key.pem ubuntu@$MASTER_IP

# Attendre que user-data se termine (15-20 min)
tail -f /var/log/cloud-init-output.log

# Vérifier l'installation
cat /tmp/k8s-install.log

# COPIER la commande kubeadm join affichée!
# Elle ressemble à:
# kubeadm join 10.0.1.X:6443 --token abc... --discovery-token-ca-cert-hash sha256:xyz...

# Vérifier les nœuds
kubectl get nodes
# Le master devrait être Ready après quelques minutes
```

#### 5.2 Joindre les Workers

```bash
# Worker 1
ssh -i chuzone-key.pem ubuntu@$WORKER1_IP

# Attendre la fin de l'installation
tail -f /var/log/cloud-init-output.log

# Exécuter la commande kubeadm join copiée
sudo kubeadm join 10.0.1.X:6443 --token abc... --discovery-token-ca-cert-hash sha256:xyz...

# Répéter pour Worker 2
ssh -i chuzone-key.pem ubuntu@$WORKER2_IP
sudo kubeadm join ...
```

#### 5.3 Vérifier le Cluster

```bash
# Sur le Master
kubectl get nodes
# Tous doivent être Ready

kubectl get pods -A
# Tous doivent être Running
```

### PHASE 6: GitOps avec ArgoCD

#### 6.1 Installer ArgoCD

```bash
# Sur le Master
kubectl create namespace argocd

kubectl apply -n argocd -f \
  https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Attendre que tous les pods soient Running
kubectl get pods -n argocd -w
```

#### 6.2 Accéder à ArgoCD

```bash
# Récupérer le mot de passe
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d && echo

# Exposer ArgoCD
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'

# Obtenir le port
kubectl get svc argocd-server -n argocd
# Notez le port (ex: 30xxx)

# Accéder via le navigateur
# http://MASTER_IP:PORT
# Login: admin
# Password: le mot de passe récupéré ci-dessus
```

#### 6.3 Créer le Repository GitOps

```bash
# Sur GitHub, créez un nouveau repo: chuzone-gitops

# Localement
cd kubernetes-manifests

# IMPORTANT: Modifier deployment.yml
# Remplacez VOTRE_USERNAME par votre username Docker Hub

# Puis
git init
git add .
git commit -m "Initial GitOps manifests"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/chuzone-gitops.git
git push -u origin main
```

#### 6.4 Configurer DuckDNS

```bash
# 1. Allez sur https://www.duckdns.org
# 2. Connectez-vous avec GitHub
# 3. Créez un domaine: chuzone
# 4. Dans "current ip", entrez: $MASTER_IP
# 5. Cliquez "update ip"
# 6. Testez: ping chuzone.duckdns.org
```

#### 6.5 Déployer avec ArgoCD

```bash
# Modifiez argocd-application.yml
# Remplacez VOTRE_USERNAME par votre username GitHub

# Appliquer
kubectl apply -f argocd-application.yml

# Vérifier
kubectl get application -n argocd

# Attendre la synchronisation
kubectl get pods -n examen-26 -w

# Vérifier le service
kubectl get svc -n examen-26
```

#### 6.6 Tester l'Application

```bash
# Via NodePort
curl http://$MASTER_IP:30080

# Via DNS (configurez un ingress si nécessaire)
curl http://chuzone.duckdns.org
```

## ✅ Checklist Finale

### Phase 1 - CI/CD (5 points)
- [ ] Tests unitaires passent dans GitHub Actions
- [ ] Build réussit
- [ ] Image Docker `1.0.0-RC1` sur Docker Hub
- [ ] Aucun secret en clair

### Phase 2 - Release (3 points)
- [ ] Workflow release se déclenche au merge
- [ ] Image retaguée sans rebuild
- [ ] Image `1.0.0` sur Docker Hub
- [ ] Tag Git `v1.0.0` créé

### Phase 3 - Infrastructure (5 points)
- [ ] 3 instances EC2 créées via Terraform
- [ ] Type t2.medium, 16 Go
- [ ] Kubernetes v1.31 installé
- [ ] CNI Calico fonctionnel
- [ ] 3 nœuds Ready

### Phase 4 - GitOps (7 points)
- [ ] ArgoCD installé
- [ ] Repo GitOps créé
- [ ] Auto-sync activé
- [ ] Namespace examen-26 créé
- [ ] Application déployée
- [ ] DNS configuré
- [ ] Application accessible

## 🔧 Dépannage

### Tests échouent
```bash
cd frontend
npm install
npm test
```

### Docker build échoue
```bash
cd frontend
docker build -t test .
```

### Nodes pas Ready
```bash
kubectl describe node NODE_NAME
kubectl logs -n kube-system -l k8s-app=calico-node
```

### ArgoCD ne sync pas
```bash
kubectl get application -n argocd
kubectl describe application chuzone-app -n argocd
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller
```

## 💰 Nettoyer l'Infrastructure

```bash
# IMPORTANT: Pour éviter les frais
cd terraform
terraform destroy
# Tapez "yes"
```

## 📞 Support

Pour toute question, créez une issue sur le repository GitHub.

---

**Auteur**: Jiji  
**Projet**: POC DevOps ChuZone  
**Institution**: Sesame University  
**Date**: Janvier 2026

**Bonne chance pour l'examen! 🎓🚀**
