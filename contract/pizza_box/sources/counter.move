module pizza_box::counter {
    use iota::event;

    /// Counter object that stores the count value
    public struct Counter has key, store {
        id: UID,
        value: u64,
        owner: address,
    }

    /// Event emitted when counter is incremented
    public struct IncrementEvent has copy, drop {
        counter_id: ID,
        old_value: u64,
        new_value: u64,
    }

    /// Event emitted when counter is decremented
    public struct DecrementEvent has copy, drop {
        counter_id: ID,
        old_value: u64,
        new_value: u64,
    }

    /// Event emitted when counter is reset
    public struct ResetEvent has copy, drop {
        counter_id: ID,
        old_value: u64,
    }

    /// Create a new counter for the sender
    public entry fun create(ctx: &mut TxContext) {
        let sender = ctx.sender();
        let counter = Counter {
            id: object::new(ctx),
            value: 0,
            owner: sender,
        };
        transfer::share_object(counter);
    }

    /// Increment the counter by 1
    public entry fun increment(counter: &mut Counter) {
        let old_value = counter.value;
        counter.value = counter.value + 1;
        
        event::emit(IncrementEvent {
            counter_id: object::id(counter),
            old_value,
            new_value: counter.value,
        });
    }

    /// Decrement the counter by 1 (only if value > 0)
    public entry fun decrement(counter: &mut Counter) {
        assert!(counter.value > 0, 0);
        let old_value = counter.value;
        counter.value = counter.value - 1;
        
        event::emit(DecrementEvent {
            counter_id: object::id(counter),
            old_value,
            new_value: counter.value,
        });
    }

    /// Reset the counter to 0
    public entry fun reset(counter: &mut Counter) {
        let old_value = counter.value;
        counter.value = 0;
        
        event::emit(ResetEvent {
            counter_id: object::id(counter),
            old_value,
        });
    }

    /// Increment by custom amount
    public entry fun add(counter: &mut Counter, amount: u64) {
        let old_value = counter.value;
        counter.value = counter.value + amount;
        
        event::emit(IncrementEvent {
            counter_id: object::id(counter),
            old_value,
            new_value: counter.value,
        });
    }

    /// Get the current counter value (view function)
    public fun get_value(counter: &Counter): u64 {
        counter.value
    }

    /// Get the counter owner (view function)
    public fun get_owner(counter: &Counter): address {
        counter.owner
    }
}
