pipeline {
  agent any
  environment {
    version = '1.0'
    DOCKER_IMAGE = "node:20.17.0"
    HOST_TARGET_DIR = "/var/www/zeli8888/storage-management"
  }
  
  stages {
    stage('Test and Build') {
      steps {
        script {
          sh """
            docker run --rm \
              --name storage-management-frontend \
              -v ${WORKSPACE}:/app \
              -w /app \
              ${DOCKER_IMAGE} \
              sh -c 'npm install && npm run test && npm run build'
          """
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          sh "mkdir -p ${HOST_TARGET_DIR}"
          
          sh "cp -rf ${WORKSPACE}/dist/* ${HOST_TARGET_DIR}/"
        }
      }
    }
  }
}
// For local dev
// docker run -it --rm --name test-app -p 3006:3006 -v ${PWD}:/app -w /app node:20.17.0 sh -c 'npm start -- --host 0.0.0.0'
// For local test
// docker run --rm --name test-app -v ${PWD}:/app -w /app node:20.17.0 sh -c 'npm install && npm run test:update && npm run build'