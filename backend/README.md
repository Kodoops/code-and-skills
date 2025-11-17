## Mémo connexions (à coller dans tes README/env)
•	Postgres (depuis un container) : jdbc:postgresql://postgres:5432/codeandskills (user/pass: postgres/postgres)

•	Postgres (depuis ta machine) : jdbc:postgresql://localhost:5432/codeandskills

•	pgAdmin UI : http://localhost:5050 (admin@codeandskills.local / admin)

→ Ajouter un serveur : Host: postgres, Port: 5432, User: postgres, Pass: postgres

•	smtp4dev UI : http://localhost:1080 — SMTP: smtp4dev:25

•	Redis (containers) : redis://redis:6379 ; (host) : redis://localhost:6379

•	Redis Insight UI : http://localhost:5540

•	Zookeeper (containers) : zookeeper:2181

•	Kafka :

•	Depuis un container : kafka:29092

•	Depuis ta machine : localhost:9092

•	Kafdrop UI : http://localhost:9000

•	Eureka : http://localhost:8761


## Commandes utiles

### Lancer uniquement l’infra
docker compose --profile infra up -d

### Lancer l’infra + services
docker compose --profile infra --profile services up -d

### Vérifier l’état
docker compose ps
docker compose logs -f kafka
docker compose logs -f discovery-service