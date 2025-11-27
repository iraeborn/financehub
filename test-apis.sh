#!/bin/bash

# Test Script for FinanceControl APIs
echo "🧪 Testing FinanceControl APIs..."

# Base URL
BASE_URL="http://localhost:3000/api"

# Test 1: Dashboard API
echo "1. Testing Dashboard API..."
curl -s "$BASE_URL/dashboard?userId=user-1" | jq '.' > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Dashboard API working"
else
    echo "❌ Dashboard API failed"
fi

# Test 2: Accounts API
echo "2. Testing Accounts API..."
curl -s "$BASE_URL/accounts?userId=user-1" | jq '.' > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Accounts API working"
else
    echo "❌ Accounts API failed"
fi

# Test 3: Categories API
echo "3. Testing Categories API..."
curl -s "$BASE_URL/categories?userId=user-1" | jq '.' > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Categories API working"
else
    echo "❌ Categories API failed"
fi

# Test 4: Credit Cards API
echo "4. Testing Credit Cards API..."
curl -s "$BASE_URL/credit-cards?userId=user-1" | jq '.' > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Credit Cards API working"
else
    echo "❌ Credit Cards API failed"
fi

# Test 5: Goals API
echo "5. Testing Goals API..."
curl -s "$BASE_URL/goals?userId=user-1" | jq '.' > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Goals API working"
else
    echo "❌ Goals API failed"
fi

# Test 6: Transactions API
echo "6. Testing Transactions API..."
curl -s "$BASE_URL/transactions?userId=user-1" | jq '.' > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Transactions API working"
else
    echo "❌ Transactions API failed"
fi

echo ""
echo "🎯 Test completed! Check the results above."
echo ""
echo "📱 Open your browser and navigate to: http://localhost:3000"
echo "🔗 Try clicking on the action buttons to test the functionality."