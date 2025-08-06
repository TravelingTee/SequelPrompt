// Mock API service that works without a backend
class MockApiService {
  private token: string | null = null;
  private users: any[] = [];
  private currentUser: any = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    this.currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
  }

  private saveToStorage() {
    localStorage.setItem('mock_users', JSON.stringify(this.users));
    localStorage.setItem('current_user', JSON.stringify(this.currentUser));
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async register(email: string, password: string, name: string) {
    await this.delay(1000); // Simulate network delay

    // Check if user exists
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = {
      id: Date.now().toString(),
      email,
      name,
      plan: 'free',
      generationsUsed: 0,
      generationsLimit: 3,
      createdAt: new Date().toISOString()
    };

    this.users.push({ ...user, password });
    this.currentUser = user;
    this.token = `mock_token_${user.id}`;
    
    localStorage.setItem('auth_token', this.token);
    this.saveToStorage();

    return {
      message: 'User created successfully',
      token: this.token,
      user
    };
  }

  async login(email: string, password: string) {
    await this.delay(1000);

    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    this.currentUser = { ...user };
    delete this.currentUser.password;
    this.token = `mock_token_${user.id}`;
    
    localStorage.setItem('auth_token', this.token);
    this.saveToStorage();

    return {
      message: 'Login successful',
      token: this.token,
      user: this.currentUser
    };
  }

  async getCurrentUser() {
    if (!this.token || !this.currentUser) {
      throw new Error('Not authenticated');
    }

    return {
      user: this.currentUser
    };
  }

  logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }

  async generateSinglePrompt(data: any) {
    await this.delay(2000); // Simulate AI processing

    if (!this.currentUser) {
      throw new Error('Authentication required');
    }

    if (this.currentUser.generationsUsed >= this.currentUser.generationsLimit) {
      throw new Error('Daily generation limit reached. Upgrade your plan for more generations.');
    }

    // Mock AI response
    const mockResponse = this.generateMockSinglePrompt(data);

    // Update usage
    this.currentUser.generationsUsed += 1;
    this.saveToStorage();

    return {
      content: mockResponse,
      tokensUsed: Math.floor(Math.random() * 500) + 200,
      cost: 0.02,
      generationsRemaining: this.currentUser.generationsLimit - this.currentUser.generationsUsed
    };
  }

  async generateAgenticWorkflow(data: any) {
    await this.delay(3000); // Simulate longer AI processing

    if (!this.currentUser) {
      throw new Error('Authentication required');
    }

    if (this.currentUser.generationsUsed >= this.currentUser.generationsLimit) {
      throw new Error('Daily generation limit reached. Upgrade your plan for more generations.');
    }

    // Mock AI response
    const mockResponse = this.generateMockAgenticWorkflow(data);

    // Update usage
    this.currentUser.generationsUsed += 1;
    this.saveToStorage();

    return {
      content: mockResponse,
      tokensUsed: Math.floor(Math.random() * 800) + 400,
      cost: 0.05,
      generationsRemaining: this.currentUser.generationsLimit - this.currentUser.generationsUsed
    };
  }

  private generateMockSinglePrompt(data: any): string {
    return `# Optimized AI Prompt

## Context & Role
You are a ${data.industry || 'professional'} expert helping ${data.targetAudience || 'users'} with ${data.mainIdea}.

## Task
${data.mainIdea}

## Requirements
- Tone: ${data.tone}
- Format: ${data.outputFormat.replace('-', ' ')}
- Length: ${data.length}
${data.context ? `- Context: ${data.context}` : ''}
${data.requirements ? `- Additional Requirements: ${data.requirements}` : ''}

## Instructions
1. Analyze the request carefully
2. Provide a ${data.length} response in ${data.tone} tone
3. Format the output as ${data.outputFormat.replace('-', ' ')}
4. Ensure accuracy and relevance

## Output Format
Please structure your response clearly and provide actionable insights.

---
*This prompt has been optimized for clarity, specificity, and effectiveness with AI models.*`;
  }

  private generateMockAgenticWorkflow(data: any): string {
    return `# AI Agent Workflow Specification

## Agent Identity
**Role**: ${data.industry || 'General'} Automation Agent
**Objective**: ${data.mainIdea}

## System Prompt
\`\`\`
You are an autonomous AI agent specialized in ${data.industry || 'general tasks'}. Your primary objective is to ${data.mainIdea}.

You have access to the following capabilities:
- Web browsing and research
- Data analysis and processing
- Communication tools
- File management
- API integrations

Always prioritize accuracy, efficiency, and user safety in your operations.
\`\`\`

## Workflow Breakdown

### Phase 1: Planning & Analysis
1. **Analyze Requirements**
   - Parse user input and context
   - Identify key objectives and constraints
   - Determine required resources and tools

2. **Create Execution Plan**
   - Break down task into subtasks
   - Establish dependencies and priorities
   - Set success criteria and checkpoints

### Phase 2: Execution
1. **Data Gathering**
   - Collect relevant information
   - Validate data sources
   - Process and structure data

2. **Task Processing**
   - Execute core workflow logic
   - Apply business rules and constraints
   - Generate intermediate results

3. **Quality Assurance**
   - Validate outputs against criteria
   - Perform error checking
   - Implement fallback procedures

### Phase 3: Delivery & Monitoring
1. **Result Compilation**
   - Format outputs according to specifications
   - Generate reports and summaries
   - Prepare deliverables

2. **Monitoring & Feedback**
   - Track performance metrics
   - Log activities and decisions
   - Provide status updates

## Required Tools & Capabilities
${data.agentCapabilities || `
- Web scraping and API access
- Data processing and analysis
- Communication interfaces
- File system operations
- Scheduling and automation
`}

## Success Criteria
${data.workflowParams || `
- Task completion within specified timeframe
- Output quality meets defined standards
- No critical errors or failures
- User satisfaction with results
`}

## Safety & Constraints
- Always verify data before processing
- Implement rate limiting for external APIs
- Maintain audit logs of all actions
- Require human approval for critical decisions
- Respect privacy and security requirements

## Error Handling
1. **Graceful Degradation**: Continue with reduced functionality if possible
2. **Retry Logic**: Implement exponential backoff for transient failures
3. **Human Escalation**: Alert operators for unresolvable issues
4. **Rollback Procedures**: Maintain ability to undo changes if needed

## Implementation Notes
- Compatible with LangChain, AutoGPT, and similar frameworks
- Requires monitoring dashboard for operational oversight
- Should be deployed with appropriate resource limits
- Regular updates needed for evolving requirements

---
*This workflow specification provides a complete foundation for implementing an autonomous AI agent system.*`;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser;
  }

  // Placeholder methods for other API calls
  async getGenerationHistory() {
    return { generations: [], pagination: { page: 1, total: 0 } };
  }

  async getUserStats() {
    return { user: this.currentUser, stats: {} };
  }

  async createCheckoutSession() {
    throw new Error('Billing not implemented in demo mode');
  }

  async createPortalSession() {
    throw new Error('Billing not implemented in demo mode');
  }
}

export default new MockApiService();
