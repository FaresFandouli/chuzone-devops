# 🚀 DÉMARRAGE RAPIDE - ChuZone DevOps POC

## 📥 Vous avez téléchargé le projet !

### Structure du fichier ZIP
```
chuzone-devops-project.zip
├── frontend/                    # Application React
├── .github/workflows/          # CI/CD Pipelines  
├── terraform/                  # Infrastructure AWS
├── kubernetes-manifests/       # Manifests K8s
├── README.md                   # Documentation principale
└── GUIDE_COMPLET.md           # Guide détaillé étape par étape
```

## ⚡ 3 Étapes pour Démarrer

### 1️⃣ Extraire et Initialiser
```bash
# Extraire le ZIP
unzip chuzone-devops-project.zip
cd chuzone-devops-project

# Tester l'application localement
cd frontend
npm install
npm start
# → http://localhost:3000
```

### 2️⃣ Créer le Repository GitHub
```bash
# Sur GitHub.com, créez: chuzone-devops

# Puis:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/chuzone-devops.git
git push -u origin main
```

### 3️⃣ Configurer les Secrets
```bash
# Sur GitHub: Settings → Secrets → Actions
# Ajoutez:
# - DOCKERHUB_USERNAME: votre-username
# - DOCKERHUB_TOKEN: votre-token
```

## 📚 Documentation

**Pour le guide complet étape par étape**, ouvrez:
- `GUIDE_COMPLET.md` - Guide détaillé avec toutes les commandes

**Pour la vue d'ensemble**, ouvrez:
- `README.md` - Documentation générale du projet

## ✅ Checklist Avant de Commencer

- [ ] Node.js 18+ installé (`node --version`)
- [ ] Docker installé (`docker --version`)
- [ ] Git installé (`git --version`)
- [ ] Compte GitHub créé
- [ ] Compte Docker Hub créé
- [ ] Compte AWS créé (pour Phase 3)
- [ ] AWS CLI installé (pour Phase 3)
- [ ] Terraform installé (pour Phase 3)

## 🎯 Les 4 Phases du Projet

### Phase 1: CI/CD (5 points)
✅ Tests automatiques  
✅ Build Docker  
✅ Push vers Docker Hub

### Phase 2: Release (3 points)
✅ Promotion de version  
✅ Tag Git automatique

### Phase 3: Infrastructure (5 points)
✅ 3 instances EC2 avec Terraform  
✅ Kubernetes avec kubeadm

### Phase 4: GitOps (7 points)
✅ ArgoCD  
✅ Déploiement automatique  
✅ DNS public

## 🆘 Besoin d'Aide ?

1. **Application ne démarre pas** → `npm install` puis `npm start`
2. **Tests échouent** → Vérifiez Node.js version (≥18)
3. **Docker build échoue** → Vérifiez Docker Desktop
4. **Questions sur le projet** → Consultez GUIDE_COMPLET.md

## 📞 Support

Créez une issue sur le repository GitHub si vous avez des questions.

---

**🎓 Bon courage pour votre examen !**

Ce projet contient TOUT ce dont vous avez besoin pour réussir les 4 phases (20/20 points).

**Next Steps:**
1. Lisez le `GUIDE_COMPLET.md`
2. Testez l'application localement
3. Suivez les phases une par une
4. N'oubliez pas de `terraform destroy` à la fin !

---

**Auteur**: Jiji  
**Projet**: POC DevOps ChuZone  
**Institution**: Sesame University
