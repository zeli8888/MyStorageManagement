pipeline{

  agent any
  environment {
    version = '1.0'
  }

  tools {
    nodejs "NodeJS24" // Reference the NodeJS installation
  }
  
  stages{
    stage('Test'){
        steps{
            sh 'npm install'
            sh 'npm run test'
        }
    }

    stage('Build'){
      steps{
        sh 'npm run build'
      }
    }

    stage('Deploy'){
      steps{
        sh "cp -rf dist/* /home/ubuntu/zeli8888/storage-management/frontend/"
      }
    }
  }
}