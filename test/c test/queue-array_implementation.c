// Queue - Array based implementation
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#define MAX_SIZE 101

// define the data structure
struct Queue
{
    int data[MAX_SIZE];
    int front;
    int rear;
};

// functions
struct Queue *CreateQueue()
{
    struct Queue *q = (struct Queue *)malloc(sizeof(struct Queue));
    q->front = -1;
    q->rear = -1;
    return q;
}

bool IsEmpty(struct Queue *q)
{
    return q->front == -1 && q->rear == -1;
}

bool IsFull(struct Queue *q)
{
    return (q->rear + 1) % MAX_SIZE == q->front;
}

void Enqueue(struct Queue *q, int x)
{
    if (IsFull(q))
        return;
    else if (IsEmpty(q))
    {
        q->front = 0;
        q->rear = 0;
    }
    else
    {
        q->rear = (q->rear + 1) % MAX_SIZE;
    }
    q->data[q->rear] = x;
}

void Dequeue(struct Queue *q)
{
    if (IsEmpty(q))
        return;
    else if (q->front == q->rear)
    {
        q->front = -1;
        q->rear = -1;
    }
    else
    {
        q->front = (q->front + 1) % MAX_SIZE;
    }
}

int Front(struct Queue *q)
{
    if (IsEmpty(q))
        return -1;
    else
        return q->data[q->front];
}

void Print(struct Queue *q)
{
    printf("===Queue===\n");

    if (IsEmpty(q))
    {
        printf("The queue is empty.\n");
    }
    else
    {
        for (int i = q->front; i <= q->rear; i++)
        {
            printf("%d ", q->data[i]);
        }
        printf("\n");
    }

    printf("===========\n");
}

int main()
{
    struct Queue *q = CreateQueue();

    // Enqueue test
    Enqueue(q, 1);
    Enqueue(q, 2);
    Enqueue(q, 3);
    Enqueue(q, 4);

    // Front/Dequeue test
    printf("Front is %d.\n", Front(q));
    Dequeue(q);
    printf("Front is %d.\n", Front(q));
    Dequeue(q);
    printf("Front is %d.\n", Front(q));
    Dequeue(q);
    printf("Front is %d.\n", Front(q));
    Dequeue(q);
    printf("Front is %d.\n", Front(q));
    // Enqueue(q, 1);
    // Enqueue(q, 2);

    Print(q);
}
