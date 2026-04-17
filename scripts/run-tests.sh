#!/bin/bash

# Script to run tests with different profiles and browsers

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
PROFILE="ui"
BROWSER="chromium"
ENVIRONMENT="dev"
TAGS=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --profile)
      PROFILE="$2"
      shift 2
      ;;
    --browser)
      BROWSER="$2"
      shift 2
      ;;
    --env)
      ENVIRONMENT="$2"
      shift 2
      ;;
    --tags)
      TAGS="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Playwright BDD Framework${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Profile: ${YELLOW}$PROFILE${NC}"
echo -e "Browser: ${YELLOW}$BROWSER${NC}"
echo -e "Environment: ${YELLOW}$ENVIRONMENT${NC}"
echo -e "Tags: ${YELLOW}${TAGS:-'All'}${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Set environment variables
export ENVIRONMENT=$ENVIRONMENT
export BROWSER=$BROWSER

# Build cucumber command
CUCUMBER_CMD="npm run test:$PROFILE"

if [ ! -z "$TAGS" ]; then
  CUCUMBER_CMD="$CUCUMBER_CMD -- --tags \"$TAGS\""
fi

echo -e "${BLUE}Running tests...${NC}\n"

# Run tests
eval $CUCUMBER_CMD

# Check exit status
if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}✓ Tests completed successfully!${NC}"
else
  echo -e "\n${YELLOW}! Some tests failed!${NC}"
fi

# Offer to open reports
read -p "Open Allure report? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  npm run reports:allure
fi
