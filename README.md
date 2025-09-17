# OccuSearch Automation Testing 🚀

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Appium](https://img.shields.io/badge/Appium-automation-blue)
![Cucumber](https://img.shields.io/badge/Cucumber-BDD-green)
![REST Assured](https://img.shields.io/badge/REST_Assured-API-blueviolet)
![Linux](https://img.shields.io/badge/Linux-security-orange)
![JSON](https://img.shields.io/badge/Data_JSON-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Java](https://img.shields.io/badge/Java-11+-red)

---

## 🎯 Overview

This repository contains the **comprehensive automation and testing framework** for OccuSearch, providing end-to-end testing capabilities across multiple domains including functional, security, database, API, and manual testing.

### 🛠️ Technology Stack

- ✅ **Appium** with **Page Object Model** for mobile automation
- ✅ **Cucumber BDD** for structured test scenarios
- ✅ **REST Assured** for robust API testing
- ✅ **JSON** for flexible test data management
- ✅ **BorgSuit** for comprehensive security testing on Linux
- ✅ **Custom real-time reporting** for detailed test execution results
- ✅ **Google Sheets integration** for manual testing documentation

---

## ✨ Features

- ✅ **Modular Architecture**: Clean Page Object Model design for maintainability
- ✅ **Real-time Reporting**: Custom dashboard with live test execution status
- ✅ **Multi-Domain Testing**: API, Database, Functional, Performance, Security & Manual
- ✅ **Data-Driven Testing**: JSON-based test data management
- ✅ **BDD Framework**: Cucumber integration for readable test scenarios
- ✅ **Cross-Platform Support**: Linux compatibility for security testing
- ✅ **Cloud Integration**: Google Sheets for collaborative manual testing
- ✅ **Parallel Execution**: Support for concurrent test runs
- ✅ **Continuous Integration**: CI/CD pipeline ready
- ✅ **Detailed Documentation**: Comprehensive test case documentation

---

## 📂 Repository Structure

```
OccuSearch-Automation-Testing/
│
├── 📁 APIs/                           # API Testing Module
│   ├── 📁 data/                       # JSON test data for API tests
│   │   ├── 📄 auth_data.json         # Authentication test data
│   │   ├── 📄 user_data.json         # User management test data
│   │   └── 📄 search_data.json       # Search functionality test data
│   └── 📁 test/                       # API automation scripts
│       ├── 📁 src/
│       │   ├── 📁 main/java/
│       │   │   ├── 📁 config/        # Configuration files
│       │   │   ├── 📁 endpoints/     # API endpoint definitions
│       │   │   ├── 📁 models/        # Data models
│       │   │   └── 📁 utils/         # Utility classes
│       │   └── 📁 test/java/
│       │       ├── 📁 runners/       # Test runners
│       │       ├── 📁 stepDefs/      # Step definitions
│       │       └── 📁 tests/         # Test classes
│       ├── 📁 target/                # Build artifacts
│       └── 📄 pom.xml                # Maven configuration
│
├── 📁 Database/                       # Database Testing Module
│   ├── 📁 data/                       # Database test data
│   │   ├── 📄 connection_config.json # DB connection configurations
│   │   ├── 📄 test_queries.json     # SQL test queries
│   │   └── 📄 expected_results.json  # Expected query results
│   └── 📁 test/                       # Database testing scripts
│       ├── 📁 connection/            # DB connection utilities
│       ├── 📁 queries/               # SQL query tests
│       └── 📁 validation/            # Data validation tests
│
├── 📁 Functional/                     # Functional Testing Module
│   ├── 📁 data/                       # Functional test data
│   │   ├── 📄 login_credentials.json # Login test data
│   │   ├── 📄 search_scenarios.json  # Search test scenarios
│   │   └── 📄 user_profiles.json     # User profile test data
│   └── 📁 test/                       # Functional automation scripts
│       ├── 📁 pageObjects/           # Page Object classes
│       ├── 📁 features/              # Cucumber feature files
│       ├── 📁 stepDefinitions/       # Step definition classes
│       └── 📁 runners/               # Test runners
│
├── 📁 Manual/                         # Manual Testing Module
│   ├── 📄 README.md                  # Manual testing documentation
│   ├── 📁 test_cases/                # Manual test cases
│   ├── 📁 test_plans/                # Test planning documents
│   ├── 📁 bug_reports/               # Bug report templates
│   └── 📁 sheets_integration/        # Google Sheets integration
│
├── 📁 Performance/                    # Performance Testing Module
│   ├── 📁 data/                       # Performance test data
│   │   ├── 📄 load_scenarios.json    # Load testing scenarios
│   │   ├── 📄 stress_config.json     # Stress testing configuration
│   │   └── 📄 baseline_metrics.json  # Performance baseline data
│   └── 📁 test/                       # Performance testing scripts
│       ├── 📁 load/                  # Load testing scripts
│       ├── 📁 stress/                # Stress testing scripts
│       └── 📁 spike/                 # Spike testing scripts
│
├── 📁 Reports/                        # Test Reports & Results
│   ├── 📁 apis/                       # API test reports
│   │   ├── 📄 cucumber-reports.html  # Cucumber HTML reports
│   │   ├── 📄 extent-reports.html    # ExtentReports
│   │   └── 📁 screenshots/           # API test screenshots
│   ├── 📁 functional/                # Functional test reports
│   │   ├── 📄 test-results.html      # HTML test results
│   │   ├── 📁 screenshots/           # Test execution screenshots
│   │   └── 📁 videos/                # Test execution videos
│   ├── 📁 performance/               # Performance test reports
│   │   ├── 📄 load_test_report.html  # Load test results
│   │   ├── 📄 performance_metrics.csv # Performance metrics
│   │   └── 📁 graphs/                # Performance graphs
│   └── 📁 security/                  # Security test reports
│       ├── 📄 vulnerability_scan.html # Security scan results
│       └── 📁 logs/                  # Security test logs
│
├── 📁 Security/                       # Security Testing Module
│   ├── 📁 data/                       # Security test data
│   │   ├── 📄 vulnerability_tests.json # Vulnerability test cases
│   │   ├── 📄 security_config.json   # Security testing configuration
│   │   └── 📄 exploit_payloads.json  # Security test payloads
│   └── 📁 test/                       # Security automation scripts
│       ├── 📁 borgsuit/              # BorgSuit integration
│       ├── 📁 penetration/           # Penetration testing scripts
│       └── 📁 vulnerability/         # Vulnerability assessment
│
├── 📁 config/                         # Global Configuration
│   ├── 📄 global.properties         # Global properties file
│   ├── 📄 environments.json          # Environment configurations
│   └── 📄 capabilities.json          # Device/Browser capabilities
│
├── 📁 utilities/                      # Common Utilities
│   ├── 📁 drivers/                   # WebDriver utilities
│   ├── 📁 reporting/                 # Custom reporting utilities
│   ├── 📁 data/                      # Data handling utilities
│   └── 📁 common/                    # Common helper functions
│
├── 📄 .gitignore                     # Git ignore file
├── 📄 docker-compose.yml             # Docker configuration
├── 📄 Jenkinsfile                    # Jenkins pipeline configuration
├── 📄 pom.xml                        # Maven parent POM
└── 📄 README.md                      # Project documentation
```

---

## 🚀 Quick Start Commands

```bash
# Complete setup
git clone https://github.com/YourUsername/OccuSearch-Automation-Testing.git
cd OccuSearch-Automation-Testing
mvn clean install
```
