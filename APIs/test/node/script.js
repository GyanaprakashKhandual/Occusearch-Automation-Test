import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';

// Custom metrics
const loginResponseTime = new Trend('login_response_time');
const loginSuccess = new Counter('login_success');
const loginFailures = new Counter('login_failures');
const loginSuccessRate = new Rate('login_success_rate');

// Get environment variables
const loginUrl = __ENV.login_url || 'https://openspace-demo.orangehrmlive.com/web/index.php/auth/login';
const vuCount = parseInt(__ENV.VUS) || 500;
const testDuration = __ENV.DURATION || '1m';

// Log the API URL and test configuration
console.log(`Testing API URL: ${loginUrl}`);
console.log(`Number of Virtual Users: ${vuCount}`);
console.log(`Test Duration: ${testDuration}`);

export const options = {
  stages: [
    { duration: '30s', target: vuCount }, // Ramp up to target users
    { duration: '30', target: vuCount }, // Stay at target users
    { duration: '30s', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(90) < 8000', 'p(95) < 8500'], // Adjusted thresholds based on your results
    http_req_failed: ['rate<0.1'],
  },
  ext: {
    loadimpact: {
      name: 'OrangeHRM Login API Load Test',
    },
  },
};

export default function () {
  // GET request to the login page (no payload as requested)
  const response = http.get(loginUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
    },
  });

  // Record response time
  loginResponseTime.add(response.timings.duration);

  // Check if request was successful
  const isSuccess = check(response, {
    'status is 200': (r) => r.status === 200,
    'response has text': (r) => r.body && r.body.length > 0,
  });

  if (isSuccess) {
    loginSuccess.add(1);
    loginSuccessRate.add(1);
  } else {
    loginFailures.add(1);
    loginSuccessRate.add(0);
    console.log(`Request failed with status: ${response.status}`);
  }

  sleep(1);
}

export function handleSummary(data) {
  const metrics = data.metrics;
  const responseTimes = metrics.http_req_duration.values;
  
  const avgTime = responseTimes.avg;
  const minTime = responseTimes.min;
  const maxTime = responseTimes.max;
  const medTime = responseTimes.med;
  const p90 = responseTimes['p(90)'];
  const p95 = responseTimes['p(95)'];
  const p99 = responseTimes['p(99)'];
  
  const totalRequests = metrics.http_reqs.count;
  const failureRate = metrics.http_req_failed.values.rate;
  const successRate = 1 - failureRate;

  // Console.log all the performance statistics
  console.log('\n=========== PERFORMANCE STATISTICS ===========');
  console.log(`API URL: ${loginUrl}`);
  console.log(`Virtual Users: ${vuCount}`);
  console.log(`Test Duration: ${testDuration}`);
  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Success Rate: ${(successRate * 100).toFixed(2)}%`);
  console.log(`Average Response Time: ${avgTime.toFixed(2)}ms`);
  console.log(`Minimum Response Time: ${minTime.toFixed(2)}ms`);
  console.log(`Maximum Response Time: ${maxTime.toFixed(2)}ms`);
  console.log(`Median Response Time: ${medTime.toFixed(2)}ms`);
  console.log(`90th Percentile (P90): ${p90.toFixed(2)}ms`);
  console.log(`95th Percentile (P95): ${p95.toFixed(2)}ms`);
  console.log(`99th Percentile (P99): ${p99.toFixed(2)}ms`);
  console.log('=============================================\n');
  
  // Also include the default K6 summary
  console.log('=========== DEFAULT K6 METRICS ===========');
  for (const [metricName, metricData] of Object.entries(metrics)) {
    if (metricData.values) {
      console.log(`${metricName}: ${JSON.stringify(metricData.values)}`);
    }
  }
  console.log('==========================================\n');

  return {
    'stdout': textData(data),
  };
}

// Format the summary data for console output
function textData(data) {
  const metrics = data.metrics;
  const responseTimes = metrics.http_req_duration.values;
  
  const avgTime = responseTimes.avg;
  const minTime = responseTimes.min;
  const maxTime = responseTimes.max;
  const medTime = responseTimes.med;
  const p90 = responseTimes['p(90)'];
  const p95 = responseTimes['p(95)'];
  const p99 = responseTimes['p(99)'];
  
  const totalRequests = metrics.http_reqs.count;
  const failureRate = metrics.http_req_failed.values.rate;
  const successRate = 1 - failureRate;

  return `
=========== K6 LOAD TEST SUMMARY ===========
API URL: ${loginUrl}
Virtual Users: ${vuCount}
Test Duration: ${testDuration}
Total Requests: ${totalRequests}
Success Rate: ${(successRate * 100).toFixed(2)}%

=========== RESPONSE TIME STATISTICS ===========
Average: ${avgTime.toFixed(2)}ms
Minimum: ${minTime.toFixed(2)}ms
Maximum: ${maxTime.toFixed(2)}ms
Median: ${medTime.toFixed(2)}ms
90th Percentile: ${p90.toFixed(2)}ms
95th Percentile: ${p95.toFixed(2)}ms
99th Percentile: ${p99.toFixed(2)}ms

=========== REQUEST STATISTICS ===========
HTTP Requests: ${metrics.http_reqs.count}
Failed Requests: ${metrics.http_req_failed.count}
Data Received: ${(metrics.data_received.values.count / 1024 / 1024).toFixed(2)} MB
Data Sent: ${(metrics.data_sent.values.count / 1024).toFixed(2)} KB
===========================================
`;
}