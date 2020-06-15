#! /bin/sh
aws lambda add-permission --function-name bargain-notifier:prod \
--statement-id apigateway-invoke-permissions-2 --action lambda:InvokeFunction \
--principal apigateway.amazonaws.com \
--source-arn "arn:aws:execute-api:ap-southeast-2:407075709236:jqjhg6iepc/*/*/bargain"


