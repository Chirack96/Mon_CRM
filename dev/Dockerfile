# Étape 1 : Construire l'application
FROM maven:3.9.8-eclipse-temurin-21-alpine AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests && \
    rm -rf ~/.m2/repository

# Étape 2 : Exécuter l'application
FROM eclipse-temurin:21-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
