pipeline {
  agent any

  environment {
    DOCKER_IMAGE = 'ejji/ongil-frontend:latest'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build & Push Docker Image') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-id',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo "✅ 프론트엔드 Docker 이미지 빌드"
            docker build -t $DOCKER_IMAGE .

            echo "🐳 Docker Hub 로그인 및 푸시"
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker push $DOCKER_IMAGE
          '''
        }
      }
    }

    stage('Deploy to EC2 via SSH') {
      steps {
        sshagent(credentials: ['ec2-ssh-key-id']) {
          sh '''
            echo "🚀 EC2 프론트엔드 배포 시작"
            ssh -o StrictHostKeyChecking=no ubuntu@3.35.24.187 '
              cd ~/Ongil_project &&
              docker compose pull frontend &&
              docker compose up -d frontend &&
              echo "[✅] 프론트 배포 완료"
            '
          '''
        }
      }
    }
  }

  post {
    success {
      echo '✅ 프론트엔드 파이프라인 완료!'
    }
    failure {
      echo '❌ 프론트엔드 파이프라인 실패. 로그 확인 요망.'
    }
  }
}