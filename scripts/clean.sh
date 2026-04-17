#!/bin/bash

# Clean test reports and logs
echo "Cleaning test reports and logs..."

rm -rf reports/allure-results/*
rm -rf reports/allure-report/*
rm -rf reports/cucumber/*
rm -rf reports/playwright/*
rm -rf logs/*

echo "✓ Cleanup completed successfully!"
