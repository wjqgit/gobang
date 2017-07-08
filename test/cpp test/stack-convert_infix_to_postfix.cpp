// Stack - Convert infix expression to postfix expression
#include <iostream>
#include <stack>
#include <string>

using namespace std;

// define functions
string Convert(string expression);

bool HasHigherPrecedence(char oprt1,char oprt2);

int GetPrecedence(char oprt);

bool IsRightAssociative(char oprt);

bool IsOperand(char c);

bool IsOperator(char c);

bool IsOpeningSymbol(char c);

bool IsClosingSymbol(char c);

int main()
{
    string expression;
    cout << "Enter an infix expression: ";
    getline(cin, expression);
    cout << "Output: " << Convert(expression) << endl;
}

// implement functions
string Convert(string expression)
{
    string result = "";
    int len = expression.length();
    stack<char> s; // stack of operators and parentheses

    for (int i = 0; i < len; i++)
    {
        char c = expression[i];

        if (c == ' ' || c == ',')
            continue;

        // if the character is a operand, append it to the result
        if (IsOperand(c))
        {
            result += c;
        }
        // if the character is a operator, continue to append the top of stack to result and pop the stack if the top is an operator with higher precedence, then push it into the stack
        else if (IsOperator(c))
        {
            while (!s.empty() && IsOperator(s.top()) && HasHigherPrecedence(s.top(), c))
            {
                result += s.top();
                s.pop();
            }
            s.push(c);
        }
        // if the character is an opening symbol, push it into the stack
        else if (IsOpeningSymbol(c))
        {
            s.push(c);
        }
        // if the character is a closing symbol, pop out all operators in the stack util the top is its pairing opening symbo (not validation), then pop the pairing symbol as well.
        else if (IsClosingSymbol(c))
        {
            while (!s.empty() && IsOperator(s.top()))
            {
                result += s.top();
                s.pop();
            }
            s.pop();
        }
    }
    while (!s.empty()) {
        result += s.top();
        s.pop();
    }

    return result;
}

bool HasHigherPrecedence(char oprt1, char oprt2)
{
    int p1 = GetPrecedence(oprt1);
    int p2 = GetPrecedence(oprt2);

    return IsRightAssociative(oprt1) ? p1 > p2 : p1 >= p2;
}

int GetPrecedence(char oprt)
{
    int p = -1;

    switch (oprt)
    {
    case '+':
    case '-':
        p = 1;
        break;
    case '*':
    case '/':
        p = 2;
        break;
    case '^':
        p = 3;
    }

    return p;
}

bool IsRightAssociative(char oprt)
{
    return oprt == '^';
}

bool IsOperand(char c)
{
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
}

bool IsOperator(char c)
{
    return c == '+' || c == '-' || c == '*' || c == '/' || c == '^';
}

bool IsOpeningSymbol(char c)
{
    return c == '(' || c == '[' || c == '{';
}

bool IsClosingSymbol(char c)
{
    return c == ')' || c == ']' || c == '}';
}