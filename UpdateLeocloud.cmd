kubectl delete -n student-a-jasic deployment ProjectMatch
kubectl delete -n student-a-jasic service ProjectMatch-svc
kubectl delete -n student-a-jasic ingress ProjectMatch-ingress
kubectl delete -n student-a-jasic pod -l app=ProjectMatch
kubectl create -f leocloud-deploy-V2.yaml