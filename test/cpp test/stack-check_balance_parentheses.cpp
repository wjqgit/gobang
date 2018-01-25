// Stack - Check balanced parentheses "() {} []"
#include <iostream>
#include <stack>
#include <string>

using namespace std;

// check is opening symbol is paired with closing symbol
bool ArePair(char open, char close)
{
    if ((open == '(' && close == ')') || (open == '[' && close == ']') || (open == '{' && close == '}'))
        return true;
    else
        return false;
}

// check if expression has balanced parentheses
bool IsBalanced(string expression)
{
    stack<char> s;

    for (int i = 0; i < expression.size(); i++)
    {
        char c = expression[i];

        if (c == '(' || c == '[' || c == '{')
        {
            s.push(c);
        }
        else if (c == ')' || c == ']' || c == '}')
        {
            if (s.empty() || !ArePair(s.top(), c))
                return false;
            else
                s.pop();
        }
    }

    if (s.empty())
        return true;
    else
        return false;
}

int main()
{
    string expression;
    cout << "Enter an expression: ";
    // std::getline(std::cin, expression);
    cin >> expression;
    cout << "The expression is " << (IsBalanced(expression) ? "" : "NOT ")
              << "balanced" << std::endl;
}
