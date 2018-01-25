// Binary Search Tree
#include<iostream>
#include<queue>
using namespace std;

// define data structure
struct Node {
    int data;
    Node* left; // left child 
    Node* right; // right child
};

// define functions
Node* CreateNode(int x);

Node* Insert(Node* root, int x);

bool Search(Node* root, int x);

int FindMin(Node* root);

int FindMinRecursively(Node* root);

int FindMax(Node* root);

int FindMaxRecursively(Node* root);

void LevelOrderTraverse(Node* root); // breadth first

void PreorderTraverse(Node* root); // depth first

void InorderTraverse(Node* root); // depth first

void PostorderTraverse(Node* root); // depth first

bool IsBinarySearchTree(Node* root);

bool IsTreeLesserThan(Node* root, int value);

bool IsTreeGreaterThan(Node* root, int value);

Node* Delete(Node* root, int value);

int GetSuccessor(Node* root, int value); // Inorder successor

int GetSuccessor(Node* root, Node* ancestor, int value);

int main() {
    cout << "Constructing BST..." << std::endl;
    struct Node* root = CreateNode(30);
    
    // Insert test
    root = Insert(root, 17);
    root = Insert(root, 35);
    root = Insert(root, 13);
    root = Insert(root, 21);
    root = Insert(root, 33);
    root = Insert(root, 40);
    root = Insert(root, 7);
    root = Insert(root, 20);
    root = Insert(root, 37);
    root = Insert(root, 48);

    // Search test
    // cout << "Contains 17? " << (Search(root, 17) ? "yes" : "no") << std::endl;
    // cout << "Contains 37? " << (Search(root, 37) ? "yes" : "no") << std::endl;
    // cout << "Contains 22? " << (Search(root, 22) ? "yes" : "no") << std::endl;

    // FindMin test
    // cout << "The minimum is " << FindMin(root) << "." << std::endl;
    
    // FindMinRecursively test
    // cout << "The minimum is " << FindMinRecursively(root) << "." << std::endl;
    
    // FindMax test
    // cout << "The maximum is " << FindMax(root) << "." << std::endl;
    
    // FindMaxRecursively test
    // cout << "The maximum is " << FindMaxRecursively(root) << "." << std::endl;

    // LevelOrderTraverse test
    // LevelOrderTraverse(root);

    // PreorderTraverse test
    // PreorderTraverse(root);

    // InorderTraverse test
    // InorderTraverse(root);

    // PostorderTraverse test
    // PostorderTraverse(root);

    // IsBinarySearchTree test
    // root->left->right->data=31;
    // cout << "Is this binary tree a BST? " << (IsBinarySearchTree(root) ? "yes" : "no") << std::endl;
    
    // Delete test
    // Delete(root, 17);
    // cout << "Is this binary tree a BST? " << (IsBinarySearchTree(root) ? "yes" : "no") << std::endl;

    // GetSuccessor test
    cout << "The in-order sucessor of 17 is " << GetSuccessor(root, 17) << std::endl;
    cout << "The in-order sucessor of 13 is " << GetSuccessor(root, 13) << std::endl;
    cout << "The in-order sucessor of 21 is " << GetSuccessor(root, 21) << std::endl;
    cout << "The in-order sucessor of 35 is " << GetSuccessor(root, 35) << std::endl;
    cout << "The in-order sucessor of 40 is " << GetSuccessor(root, 40) << std::endl;
    cout << "The in-order sucessor of 37 is " << GetSuccessor(root, 37) << std::endl;

}

// implement functions
Node* CreateNode(int x) {
    Node* node = new Node();
    node->data = x;
    node->left = node->right = NULL;
    return node;
}

struct Node* Insert(Node* root, int x) {
    if (root == NULL) {
        root = CreateNode(x);
    } else if (x <= root->data) {
        root->left = Insert(root->left, x);
    } else {
        root->right = Insert(root->right, x);
    }

    return root;
}

bool Search(Node* root, int x) {
    if (root == NULL) {
        return false;
    } else if (root->data == x) {
        return true;
    } else if (root->data > x) {
        return Search(root->left, x);
    } else if (root->data < x) {
        return Search(root->right, x);
    }
}

int FindMin(Node* root) {
    while(root->left != NULL) {
        root = root->left;
    }

    return root->data;
}


int FindMinRecursively(Node* root) {
    if (root->left == NULL) {
        return root->data;
    } else {
        return FindMinRecursively(root->left);
    }
}

int FindMax(Node* root) {
    while(root->right != NULL) {
        root = root->right;
    }

    return root->data;
}

int FindMaxRecursively(Node* root) {
    if (root->right == NULL) {
        return root->data;
    } else {
        return FindMaxRecursively(root->right);
    }
}

void LevelOrderTraverse(Node* root) {
    if (root == NULL) return;

    queue<Node*> Q;
    Q.push(root);

    while(!Q.empty()) {
        Node* temp = Q.front();
        Q.pop();
        cout << temp->data << " ";
        if (temp->left != NULL) Q.push(temp->left);
        if (temp->right != NULL) Q.push(temp->right);
    }

}

void PreorderTraverse(Node* root) {
    if (root == NULL) return;

    cout << root->data << " ";

    if (root->left != NULL) PreorderTraverse(root->left);

    if (root->right != NULL) PreorderTraverse(root->right);
}

void InorderTraverse(Node* root) {
    if (root == NULL) return;

    if (root->left != NULL) InorderTraverse(root->left);

    cout << root->data << " ";

    if (root->right != NULL) InorderTraverse(root->right);
}

void PostorderTraverse(Node* root) {
    if (root == NULL) return;
    
    if (root->left != NULL) PostorderTraverse(root->left);
    
    if (root->right != NULL) PostorderTraverse(root->right);
    
    cout << root->data << " ";
}

bool IsBinarySearchTree(Node* root) {
    if (root == NULL) return true;

    if (IsTreeLesserThan(root->left, root->data)
        && IsTreeGreaterThan(root->right, root->data) 
        && IsBinarySearchTree(root->left)
        && IsBinarySearchTree(root->right))
        return true;
    else
        return false;

}

bool IsTreeLesserThan(Node* root, int value) {
    if (root == NULL) return true;

    if (root->data < value 
        && IsTreeLesserThan(root->left, value)
        && IsTreeLesserThan(root->right, value))
        return true;
    else 
        return false;

}

bool IsTreeGreaterThan(Node* root, int value) {
    if (root == NULL) return true;

    if (root->data > value
        && IsTreeGreaterThan(root->left, value)
        && IsTreeGreaterThan(root->right, value))
        return true;
    else 
        return false;

}

Node* Delete(Node* root, int value) {
    if (root == NULL) return root;

    if (root->data > value) 
        root->left = Delete(root->left, value);
    else if (root->data < value) 
        root->right = Delete(root->right, value);
    else {

            if (root->left == NULL && root->right == NULL) {
                // case: 0 child
                delete root;
                root = NULL;
                return root;
            } else if (root->left == NULL) {
                // case: 1 child 
                Node* temp = root->right;
                delete root;
                return temp;
            } else if (root->right == NULL) {
                // case: 1 child
                Node* temp = root->left;
                delete root;
                return temp;
            } else {
                // case: 2 children
                int temp = FindMin(root->right);
                root->data = temp;
                root->right = Delete(root->right, temp);
            }
    }




}

int GetSuccessor(Node* root, int value) {
    return GetSuccessor(root, root, value);
}

int GetSuccessor(Node* root, Node* ancestor, int value) {
    if (root == NULL) return -1;

    if (root->data > value) 
        return GetSuccessor(root->left, root, value);
    else if (root->data < value) 
        return GetSuccessor(root->right, ancestor, value);
    else {
        if (root->right != NULL)
            return FindMin(root->right);
        else {
            return ancestor->data;
        }
    }


}