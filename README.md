# ChuZone DevOps POC - Frontend Only

## 📋 Vue d'ensemble
Projet DevOps complet avec CI/CD, Infrastructure Kubernetes et GitOps pour l'examen.

**Application**: React Frontend (Single Page Application avec localStorage)

## 🏗️ Architecture

```
GitHub Repository (Frontend React)
          ↓
    GitHub Actions CI/CD
    - Build & Test
    - Docker Build
    - Push to Docker Hub
          ↓
    AWS EC2 Instances (Terraform)
    - 1 Master + 2 Workers
    - Kubernetes v1.34 (kubeadm)
          ↓
    ArgoCD (GitOps)
    - Auto-sync depuis GitHub
    - Déploiement automatique
          ↓
    Application accessible via DNS
    https://chuzone.duckdns.org
```

## 📦 Structure du Projet

```
chuzone-devops-project/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── App.js           # Composant principal
│   │   ├── App.test.js      # Tests unitaires
│   │   ├── App.css          # Styles
│   │   └── index.js         # Point d'entrée
│   ├── public/
│   │   └── index.html       # Template HTML
│   ├── Dockerfile           # Image Docker
│   ├── nginx.conf           # Configuration Nginx
│   └── package.json         # Dependencies
│
├── .github/workflows/       # CI/CD Pipelines
│   ├── ci-pr.yml           # Workflow Pull Request
│   └── release-approve.yml  # Workflow Release
│
├── terraform/               # Infrastructure as Code
│   ├── main.tf             # Configuration principale
│   ├── variables.tf        # Variables
│   ├── outputs.tf          # Outputs
│   └── scripts/            # Scripts d'installation K8s
│
└── kubernetes-manifests/    # GitOps Repository
    ├── namespace.yml
    ├── deployment.yml
    ├── service.yml
    ├── ingress.yml
    └── argocd-application.yml
```

## 🚀 Guide d'Installation Complet

### PHASE 1: CI/CD GitHub Actions (5 points)

#### 1.1 Créer le Repository GitHub

```bash
# Initialisez le projet
cd chuzone-devops-project
git init
git add .
git commit -m "Initial commit: ChuZone DevOps POC"

# Créez un repo sur GitHub puis:
git remote add origin https://github.com/VOTRE-USERNAME/chuzone-devops.git
git branch -M main
git push -u origin main
```

#### 1.2 Configurer les Secrets GitHub

1. Allez sur GitHub → `Settings` → `Secrets and variables` → `Actions`
2. Cliquez sur `New repository secret`
3. Ajoutez:
   - `DOCKERHUB_USERNAME`: votre username Docker Hub
   - `DOCKERHUB_TOKEN`: votre token Docker Hub (créez-le sur hub.docker.com → Account Settings → Security)

#### 1.3 Tester le Workflow CI

```bash
# Créez une branche feature
git checkout -b feature/add-product-feature

# Faites des modifications
echo "// New feature" >> frontend/src/App.js

# Commit et push
git add .
git commit -m "feat: add new product feature"
git push origin feature/add-product-feature

# Créez une Pull Request sur GitHub
# Le workflow ci-pr.yml se déclenchera automatiquement
```

**Résultat attendu:**
- ✅ Tests unitaires passent
- ✅ Build réussit
- ✅ Image Docker `1.0.0-RC1` poussée sur Docker Hub

---

### PHASE 2: Release Management (3 points)

#### 2.1 Merger la Pull Request

```bash
# Sur GitHub, mergez la PR vers main
# Le workflow release-approve.yml se déclenchera
```

**Résultat attendu:**
- ✅ Image `1.0.0-RC1` récupérée
- ✅ Retaguée en `1.0.0` et `latest`
- ✅ Tag Git `v1.0.0` créé

#### 2.2 Vérifier sur Docker Hub

```bash
# Vérifiez que les images sont présentes
docker pull VOTRE-USERNAME/chuzone-frontend:1.0.0
docker pull VOTRE-USERNAME/chuzone-frontend:latest
```

---

### PHASE 3: Infrastructure Kubernetes (5 points)

#### 3.1 Prérequis AWS

```bash
# Installez AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configurez vos credentials
aws configure
# AWS Access Key ID: VOTRE_ACCESS_KEY
# AWS Secret Access Key: VOTRE_SECRET_KEY
# Default region: eu-west-1
# Default output format: json
```

#### 3.2 Provisionner l'Infrastructure avec Terraform

```bash
cd terraform

# Initialisez Terraform
terraform init

# Vérifiez le plan
terraform plan

# Appliquez la configuration
terraform apply
# Tapez "yes" pour confirmer

# Attendez 5-10 minutes pour la création des instances
```

**Résultat attendu:**
- ✅ 3 instances EC2 créées (t2.medium, 16 Go)
- ✅ VPC et Subnet configurés
- ✅ Security Groups créés
- ✅ IPs publiques assignées

#### 3.3 Récupérer les IPs des Instances

```bash
# Affichez les outputs Terraform
terraform output

# Vous verrez:
# master_public_ip = "54.xx.xx.xx"
# worker1_public_ip = "54.yy.yy.yy"
# worker2_public_ip = "54.zz.zz.zz"

# Exportez-les en variables
export MASTER_IP=$(terraform output -raw master_public_ip)
export WORKER1_IP=$(terraform output -raw worker1_public_ip)
export WORKER2_IP=$(terraform output -raw worker2_public_ip)
```

#### 3.4 Installer Kubernetes sur le Master

```bash
# Connectez-vous au Master
ssh -i votre-cle.pem ubuntu@$MASTER_IP

# Une fois connecté, exécutez:
sudo bash /tmp/install-k8s-master.sh

# À la fin, vous verrez une commande kubeadm join. COPIEZ-LA!
# Elle ressemble à:
# kubeadm join 10.0.1.10:6443 --token abc123... \
#   --discovery-token-ca-cert-hash sha256:xyz789...

# Configurez kubectl pour l'utilisateur ubuntu
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# Vérifiez
kubectl get nodes
# NAME     STATUS     ROLES           AGE   VERSION
# master   NotReady   control-plane   1m    v1.31.0
```

#### 3.5 Joindre les Workers au Cluster

```bash
# Dans un nouveau terminal, connectez-vous au Worker 1
ssh -i votre-cle.pem ubuntu@$WORKER1_IP

# Exécutez la commande kubeadm join copiée précédemment
sudo kubeadm join 10.0.1.10:6443 --token abc123... \
  --discovery-token-ca-cert-hash sha256:xyz789...

# Répétez pour Worker 2
ssh -i votre-cle.pem ubuntu@$WORKER2_IP
sudo kubeadm join ...
```

#### 3.6 Vérifier le Cluster

```bash
# Retournez sur le Master
ssh -i votre-cle.pem ubuntu@$MASTER_IP

# Vérifiez que tous les nœuds sont Ready
kubectl get nodes
# NAME      STATUS   ROLES           AGE   VERSION
# master    Ready    control-plane   5m    v1.31.0
# worker1   Ready    <none>          3m    v1.31.0
# worker2   Ready    <none>          3m    v1.31.0

# Vérifiez les pods système
kubectl get pods -n kube-system
# Tous doivent être Running
```

---

### PHASE 4: GitOps avec ArgoCD (7 points)

#### 4.1 Installer ArgoCD

```bash
# Sur le Master
kubectl create namespace argocd

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Attendez que tous les pods soient Ready
kubectl get pods -n argocd -w
```

#### 4.2 Accéder à l'Interface ArgoCD

```bash
# Récupérez le mot de passe initial
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo

# Exposez ArgoCD en NodePort
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'

# Obtenez le port
kubectl get svc argocd-server -n argocd
# Notez le port (ex: 30000)

# Accédez via: http://MASTER_IP:30000
# Login: admin
# Password: le mot de passe récupéré ci-dessus
```

#### 4.3 Créer le Repository GitOps

```bash
# Créez un nouveau repo GitHub: chuzone-gitops
# Puis localement:
cd kubernetes-manifests
git init
git add .
git commit -m "Initial GitOps manifests"
git remote add origin https://github.com/VOTRE-USERNAME/chuzone-gitops.git
git branch -M main
git push -u origin main
```

#### 4.4 Configurer DuckDNS

1. Allez sur https://www.duckdns.org
2. Connectez-vous avec GitHub
3. Créez un domaine: `chuzone` (devient chuzone.duckdns.org)
4. Dans "current ip", entrez l'IP publique du Master
5. Cliquez sur "update ip"

#### 4.5 Déployer l'Application via ArgoCD

```bash
# Sur le Master, créez l'Application ArgoCD
kubectl apply -f - <<EOF
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: chuzone-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/VOTRE-USERNAME/chuzone-gitops.git
    targetRevision: main
    path: .
  destination:
    server: https://kubernetes.default.svc
    namespace: examen-26
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
EOF

# Vérifiez le déploiement
kubectl get application -n argocd

# Attendez la synchronisation
kubectl get pods -n examen-26 -w
```

#### 4.6 Vérifier l'Accès

```bash
# Vérifiez le service
kubectl get svc -n examen-26

# Vérifiez l'ingress
kubectl get ingress -n examen-26

# Testez l'accès
curl http://chuzone.duckdns.org
# Ou visitez dans un navigateur
```

---

## ✅ Checklist de Validation

### Phase 1 - CI/CD (5 points)
- [ ] Application React fonctionnelle
- [ ] Tests unitaires avec Jest
- [ ] Dockerfile créé
- [ ] Workflow GitHub Actions sur PR
- [ ] Image `1.0.0-RC1` sur Docker Hub
- [ ] Aucun secret en clair dans le code

### Phase 2 - Release (3 points)
- [ ] Workflow `release-approve` créé
- [ ] Déclenchement automatique au merge
- [ ] Image `1.0.0-RC1` récupérée sans rebuild
- [ ] Retag en `1.0.0` réussi
- [ ] Tag Git `v1.0.0` créé

### Phase 3 - Infrastructure (5 points)
- [ ] 3 instances EC2 provisionnées via Terraform
- [ ] Type: t2.medium avec 16 Go
- [ ] VPC/Subnet configuré
- [ ] Kubernetes v1.31+ installé avec kubeadm
- [ ] CNI (Calico) configuré
- [ ] 3 nœuds en état Ready

### Phase 4 - GitOps (7 points)
- [ ] ArgoCD installé sur le cluster
- [ ] Repository GitOps créé sur GitHub
- [ ] Travail sur branche `main`
- [ ] Application ArgoCD configurée
- [ ] Auto-sync activé
- [ ] Namespace `examen-26` créé
- [ ] Image `1.0.0` déployée
- [ ] Application accessible via DNS

---

## 🔧 Troubleshooting

### Les tests échouent dans GitHub Actions
```bash
# Testez localement
cd frontend
npm install
npm test
```

### L'image Docker ne build pas
```bash
cd frontend
docker build -t test .
docker run -p 3000:80 test
```

### Les nœuds Kubernetes ne sont pas Ready
```bash
# Sur chaque nœud
kubectl describe node <node-name>
kubectl get pods -n kube-system

# Vérifiez les logs du CNI
kubectl logs -n kube-system -l k8s-app=calico-node
```

### ArgoCD ne synchronise pas
```bash
# Vérifiez l'application
kubectl get application -n argocd
kubectl describe application chuzone-app -n argocd

# Vérifiez les logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller
```

### L'application n'est pas accessible
```bash
# Vérifiez le pod
kubectl get pods -n examen-26
kubectl logs -n examen-26 <pod-name>

# Vérifiez le service
kubectl get svc -n examen-26
kubectl describe svc chuzone-frontend -n examen-26

# Testez localement depuis le Master
curl http://localhost:30080
```

---

## 💰 Gestion des Coûts

```bash
# Détruisez l'infrastructure après l'examen
cd terraform
terraform destroy
# Tapez "yes" pour confirmer

# Cela supprimera:
# - 3 instances EC2
# - VPC, Subnet, Security Groups
# - Toutes les ressources AWS
```

**Coût estimé**: ~2-3€/jour pour 3 instances t2.medium

---

## 📚 Ressources

- [Docker Hub](https://hub.docker.com)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io)
- [DuckDNS](https://www.duckdns.org)

---

**Auteur**: Jiji  
**Projet**: POC DevOps ChuZone  
**Institution**: Sesame University  
**Date**: Janvier 2026
