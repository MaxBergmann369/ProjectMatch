kubectl delete -n student-a-jasic deployment projectmatch
kubectl delete -n student-a-jasic service projectmatch-svc
kubectl delete -n student-a-jasic ingress projectmatch-ingress
kubectl delete -n student-a-jasic pod -l app=projectmatch
kubectl create -f leocloud-deploy-V2.yaml