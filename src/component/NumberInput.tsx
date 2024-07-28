const NumberInput = ({ label, value, onChange, editable = true }: { label: string, value: number, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, editable?: boolean }) => {
    return (
        <label style={{
            marginBottom: '20px',
        }}>
            <span>{label}</span>
            <input type="number" value={value} onChange={onChange} disabled={!editable} />
        </label>
    );
}

export default NumberInput;