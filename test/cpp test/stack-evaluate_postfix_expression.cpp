// Stack - Evaluate postfix expression
#include <iostream>
#include <stack>
#include <string>

using namespace std;

// define functions
int EvaluatePostfixExpression(string expression);

bool IsDigit(char c);

bool IsOperator(char c);

int Evaluate(int op1, int op2, char oprt);

int main()
{
    string expression;
    cout << "Enter an expression: ";
    getline(cin, expression);
    cout << "Result is " << EvaluatePostfixExpression(expression) << "." << std::endl;
}

// implement functions
int EvaluatePostfixExpression(string expression)
{
    int len = expression.size();
    // int len = expression.length();

    stack<int> s;

    for (int i = 0; i < len; i++)
    {
        char c = expression[i];

        if (c == ' ' || c == ',')
            continue;

        if (IsDigit(c))
        {
            int op = c - '0';
            while (i < len - 1 && IsDigit(expression[i + 1]))
            {
                op = op * 10 + (expression[i + 1] - '0');
                i++;
            }
            s.push(op);
        }
        else if (IsOperator(c))
        {
            int op2 = s.top();
            s.pop();
            int op1 = s.top();
            s.pop();
            s.push(Evaluate(op1, op2, c));
        }
    }

    return s.top();
}

bool IsDigit(char c)
{
    return c >= '0' && c <= '9';
}

bool IsOperator(char c)
{
    return c == '+' || c == '-' || c == '*' || c == '/';
}

int Evaluate(int op1, int op2, char oprt)
{
    if (oprt == '+')
        return op1 + op2;
    else if (oprt == '-')
        return op1 - op2;
    else if (oprt == '*')
        return op1 * op2;
    else if (oprt == '/')
        return op1 / op2;
}