// Binary Search Tree
#include<stdlib.h>
#include<stdio.h>
#include<stdbool.h>

// define data structure
struct Node {
    int data;
    struct Node* left; // left child 
    struct Node* right; // right child
};

// define functions
struct Node* CreateNode(int x);

struct Node* Insert(struct Node* root, int x);

bool Search(struct Node* root, int x);

int FindMin(struct Node* root);

int FindMinRecursively();

int FindMax(struct Node* root);

int FindMaxRecursively();

void LevelOrderTraverse(struct Node* root); // breadth first

void PreoderTraverse(struct Node* root); // depth first

void InorderTraverse(struct Node* root); // depth first

void PostorderTraverse(struct Node* root); // depth first

bool IsBinarySearchTree(struct Node* root);

void Delete(struct Node* root, int x);

struct Node* GetSuccessor(); // Inorder successor

int main() {
    printf("Constructing BST...\n");
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
    // printf("Contains 17? %s\n", Search(root, 17) ? "true" : "false");
    // printf("Contains 37? %s\n", Search(root, 37) ? "true" : "false");
    // printf("Contains 22? %s\n", Search(root, 22) ? "true" : "false");

    // FindMin test
    // printf("The minimum is %d.\n", FindMin(root));
    
    // FindMinRecursively test
    // printf("The minimum is %d.\n", FindMinRecursively(root));

    // FindMax test
    // printf("The maximum is %d.\n", FindMax(root));
    
    // FindMaxRecursively test
    // printf("The maximum is %d.\n", FindMaxRecursively(root));

    // LevelOrderTraverse test

    // PreorderTraverse test

    // InorderTraverse test

    // PostorderTraverse test

    // IsBinarySearchTree test

    // Delete test


}

// implement functions
struct Node* CreateNode(int x) {
    struct Node* node = (struct Node*) malloc(sizeof(struct Node));
    node->data = x;
    node->left = NULL;
    node->right = NULL;
    return node;
}

struct Node* Insert(struct Node* root, int x) {
    if (root == NULL) {
        root = CreateNode(x);
    } else if (x <= root->data) {
        root->left = Insert(root->left, x);
    } else {
        root->right = Insert(root->right, x);
    }

    return root;
}

bool Search(struct Node* root, int x) {
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

int FindMin(struct Node* root) {
    while(root->left != NULL) {
        root = root->left;
    }

    return root->data;
}


int FindMinRecursively(struct Node* root) {
    if (root->left == NULL) {
        return root->data;
    } else {
        return FindMinRecursively(root->left);
    }
}

int FindMax(struct Node* root) {
    while(root->right != NULL) {
        root = root->right;
    }

    return root->data;
}

int FindMaxRecursively(struct Node* root) {
    if (root->right == NULL) {
        return root->data;
    } else {
        return FindMaxRecursively(root->right);
    }
}

void LevelOrderTraverse(struct Node* root) {
    
}